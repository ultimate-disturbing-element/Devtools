"""Network service for ping, traceroute, IP lookup, and CURL builder."""
import asyncio
import aiohttp
import re
from typing import Optional
from app.core.exceptions import NetworkError
from app.config.settings import settings


class NetworkService:
    """Service for network tools."""
    
    async def ping(self, host: str, count: int = 4) -> dict:
        """Ping a host and return statistics."""
        try:
            # Use asyncio subprocess to run ping
            if count < 1 or count > 10:
                count = 4
            
            process = await asyncio.create_subprocess_exec(
                'ping', '-c', str(count), host,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                raise NetworkError(f"Ping failed: {stderr.decode()}")
            
            output = stdout.decode()
            
            # Parse output
            packets_sent = count
            packets_received = 0
            min_latency = None
            max_latency = None
            avg_latency = None
            
            # Extract received packets
            match = re.search(r'(\d+) packets received', output)
            if match:
                packets_received = int(match.group(1))
            
            # Extract latency stats
            match = re.search(r'min/avg/max/[a-z]+ = ([\d.]+)/([\d.]+)/([\d.]+)', output)
            if match:
                min_latency = float(match.group(1))
                avg_latency = float(match.group(2))
                max_latency = float(match.group(3))
            
            packet_loss = ((packets_sent - packets_received) / packets_sent) * 100
            
            return {
                "host": host,
                "packets_sent": packets_sent,
                "packets_received": packets_received,
                "packet_loss": round(packet_loss, 2),
                "min_latency": min_latency,
                "max_latency": max_latency,
                "avg_latency": avg_latency
            }
            
        except Exception as e:
            raise NetworkError(f"Failed to ping host: {str(e)}")
    
    async def traceroute(self, host: str, max_hops: int = 30) -> dict:
        """Perform traceroute to a host."""
        try:
            if max_hops < 1 or max_hops > 64:
                max_hops = 30
            
            process = await asyncio.create_subprocess_exec(
                'traceroute', '-m', str(max_hops), host,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            output = stdout.decode()
            
            hops = []
            lines = output.split('\n')
            
            for line in lines[1:]:  # Skip first line (header)
                if not line.strip():
                    continue
                
                # Parse line: " 1  router.local (192.168.1.1)  1.234 ms"
                match = re.match(r'\s*(\d+)\s+(.+)', line)
                if match:
                    hop_num = int(match.group(1))
                    hop_info = match.group(2)
                    
                    # Extract IP and hostname
                    ip_match = re.search(r'\(([0-9.]+)\)', hop_info)
                    ip = ip_match.group(1) if ip_match else None
                    
                    hostname_match = re.match(r'([^\s(]+)', hop_info)
                    hostname = hostname_match.group(1) if hostname_match else None
                    
                    # Extract latency
                    latency_match = re.search(r'([\d.]+)\s*ms', hop_info)
                    latency = float(latency_match.group(1)) if latency_match else None
                    
                    hops.append({
                        "hop_number": hop_num,
                        "ip": ip,
                        "hostname": hostname if hostname != '*' else None,
                        "latency": latency
                    })
            
            return {
                "host": host,
                "hops": hops
            }
            
        except Exception as e:
            raise NetworkError(f"Failed to traceroute: {str(e)}")
    
    async def lookup_ip(self, ip_address: str) -> dict:
        """Lookup IP address information."""
        try:
            url = f"{settings.ip_lookup_api_url}/{ip_address}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        raise NetworkError("Failed to lookup IP")
                    
                    data = await response.json()
                    
                    return {
                        "ip": ip_address,
                        "country": data.get("country"),
                        "region": data.get("regionName"),
                        "city": data.get("city"),
                        "isp": data.get("isp"),
                        "asn": data.get("as"),
                        "latitude": data.get("lat"),
                        "longitude": data.get("lon")
                    }
                    
        except Exception as e:
            raise NetworkError(f"Failed to lookup IP: {str(e)}")
    
    def build_curl_command(
        self,
        url: str,
        method: str = "GET",
        headers: dict = None,
        body: Optional[str] = None,
        auth: Optional[str] = None
    ) -> str:
        """Build a CURL command from parameters."""
        parts = ["curl"]
        
        # Method
        if method.upper() != "GET":
            parts.append(f"-X {method.upper()}")
        
        # Headers
        if headers:
            for key, value in headers.items():
                parts.append(f"-H '{key}: {value}'")
        
        # Auth
        if auth:
            parts.append(f"-u '{auth}'")
        
        # Body
        if body:
            # Escape single quotes in body
            escaped_body = body.replace("'", "'\\''")
            parts.append(f"-d '{escaped_body}'")
        
        # URL (always last)
        parts.append(f"'{url}'")
        
        return " ".join(parts)


# Singleton instance
network_service = NetworkService()
