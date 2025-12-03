"""Utility service for password, UUID, color, and JSON tools."""
import re
import math
import string
import secrets
import json
import uuid
from typing import Dict
from app.core.exceptions import ValidationError


class UtilsService:
    """Service for utility tools."""
    
    def check_password_strength(self, password: str) -> dict:
        """Check password strength and return detailed analysis."""
        length = len(password)
        has_uppercase = bool(re.search(r'[A-Z]', password))
        has_lowercase = bool(re.search(r'[a-z]', password))
        has_numbers = bool(re.search(r'\d', password))
        has_symbols = bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
        
        # Calculate entropy
        charset_size = 0
        if has_lowercase:
            charset_size += 26
        if has_uppercase:
            charset_size += 26
        if has_numbers:
            charset_size += 10
        if has_symbols:
            charset_size += 32
        
        entropy = length * math.log2(charset_size) if charset_size > 0 else 0
        
        # Calculate score (0-100)
        score = 0
        score += min(length * 4, 40)  # Length contribution (max 40)
        score += 10 if has_uppercase else 0
        score += 10 if has_lowercase else 0
        score += 15 if has_numbers else 0
        score += 25 if has_symbols else 0
        
        # Penalties
        if len(set(password)) < length / 2:  # Too much repetition
            score -= 10
        
        score = max(0, min(100, score))
        
        # Determine strength
        if score < 30:
            strength = "weak"
        elif score < 60:
            strength = "medium"
        elif score < 80:
            strength = "strong"
        else:
            strength = "very_strong"
        
        # Generate suggestions
        suggestions = []
        if length < 12:
            suggestions.append("Increase length to at least 12 characters")
        if not has_uppercase:
            suggestions.append("Add uppercase letters")
        if not has_lowercase:
            suggestions.append("Add lowercase letters")
        if not has_numbers:
            suggestions.append("Add numbers")
        if not has_symbols:
            suggestions.append("Add special symbols")
        
        return {
            "score": score,
            "strength": strength,
            "length": length,
            "has_uppercase": has_uppercase,
            "has_lowercase": has_lowercase,
            "has_numbers": has_numbers,
            "has_symbols": has_symbols,
            "entropy": round(entropy, 2),
            "suggestions": suggestions
        }
    
    def generate_password(
        self,
        length: int = 16,
        include_uppercase: bool = True,
        include_lowercase: bool = True,
        include_numbers: bool = True,
        include_symbols: bool = True
    ) -> str:
        """Generate a secure random password."""
        charset = ""
        
        if include_lowercase:
            charset += string.ascii_lowercase
        if include_uppercase:
            charset += string.ascii_uppercase
        if include_numbers:
            charset += string.digits
        if include_symbols:
            charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"
        
        if not charset:
            raise ValidationError("At least one character type must be selected")
        
        password = ''.join(secrets.choice(charset) for _ in range(length))
        return password
    
    def generate_uuids(self, count: int = 1) -> list[str]:
        """Generate UUID v4 identifiers."""
        return [str(uuid.uuid4()) for _ in range(count)]
    
    def convert_color(self, color: str) -> dict:
        """Convert color between HEX, RGB, and HSL formats."""
        color = color.strip()
        
        # Try to parse HEX
        if color.startswith('#'):
            return self._from_hex(color)
        
        # Try to parse RGB
        if color.startswith('rgb'):
            return self._from_rgb(color)
        
        # Try to parse HSL
        if color.startswith('hsl'):
            return self._from_hsl(color)
        
        raise ValidationError("Invalid color format. Use HEX, RGB, or HSL")
    
    def _from_hex(self, hex_color: str) -> dict:
        """Convert HEX to all formats."""
        hex_color = hex_color.lstrip('#')
        
        if len(hex_color) == 3:
            hex_color = ''.join([c*2 for c in hex_color])
        
        if len(hex_color) != 6:
            raise ValidationError("Invalid HEX color")
        
        try:
            r = int(hex_color[0:2], 16)
            g = int(hex_color[2:4], 16)
            b = int(hex_color[4:6], 16)
        except ValueError:
            raise ValidationError("Invalid HEX color")
        
        # Convert to HSL
        r_norm, g_norm, b_norm = r / 255, g / 255, b / 255
        max_c = max(r_norm, g_norm, b_norm)
        min_c = min(r_norm, g_norm, b_norm)
        l = (max_c + min_c) / 2
        
        if max_c == min_c:
            h = s = 0
        else:
            d = max_c - min_c
            s = d / (2 - max_c - min_c) if l > 0.5 else d / (max_c + min_c)
            
            if max_c == r_norm:
                h = (g_norm - b_norm) / d + (6 if g_norm < b_norm else 0)
            elif max_c == g_norm:
                h = (b_norm - r_norm) / d + 2
            else:
                h = (r_norm - g_norm) / d + 4
            
            h /= 6
        
        return {
            "hex": f"#{hex_color.upper()}",
            "rgb": f"rgb({r}, {g}, {b})",
            "hsl": f"hsl({int(h*360)}, {int(s*100)}%, {int(l*100)}%)"
        }
    
    def _from_rgb(self, rgb_color: str) -> dict:
        """Convert RGB to all formats."""
        match = re.search(r'rgb\((\d+),\s*(\d+),\s*(\d+)\)', rgb_color)
        if not match:
            raise ValidationError("Invalid RGB format")
        
        r, g, b = int(match.group(1)), int(match.group(2)), int(match.group(3))
        hex_color = f"#{r:02x}{g:02x}{b:02x}"
        return self._from_hex(hex_color)
    
    def _from_hsl(self, hsl_color: str) -> dict:
        """Convert HSL to all formats."""
        match = re.search(r'hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)', hsl_color)
        if not match:
            raise ValidationError("Invalid HSL format")
        
        h = int(match.group(1)) / 360
        s = int(match.group(2)) / 100
        l = int(match.group(3)) / 100
        
        # Convert HSL to RGB
        if s == 0:
            r = g = b = int(l * 255)
        else:
            def hue_to_rgb(p, q, t):
                if t < 0:
                    t += 1
                if t > 1:
                    t -= 1
                if t < 1/6:
                    return p + (q - p) * 6 * t
                if t < 1/2:
                    return q
                if t < 2/3:
                    return p + (q - p) * (2/3 - t) * 6
                return p
            
            q = l * (1 + s) if l < 0.5 else l + s - l * s
            p = 2 * l - q
            r = int(hue_to_rgb(p, q, h + 1/3) * 255)
            g = int(hue_to_rgb(p, q, h) * 255)
            b = int(hue_to_rgb(p, q, h - 1/3) * 255)
        
        hex_color = f"#{r:02x}{g:02x}{b:02x}"
        return self._from_hex(hex_color)
    
    def generate_color_palette(self, base_color: str, count: int = 5) -> dict:
        """Generate shades and tints of a color."""
        color_data = self.convert_color(base_color)
        hex_color = color_data["hex"]
        
        # Extract RGB
        hex_clean = hex_color.lstrip('#')
        r = int(hex_clean[0:2], 16)
        g = int(hex_clean[2:4], 16)
        b = int(hex_clean[4:6], 16)
        
        shades = []
        tints = []
        
        # Generate shades (darker)
        for i in range(1, count + 1):
            factor = i / (count + 1)
            shade_r = int(r * (1 - factor))
            shade_g = int(g * (1 - factor))
            shade_b = int(b * (1 - factor))
            shades.append(f"#{shade_r:02x}{shade_g:02x}{shade_b:02x}")
        
        # Generate tints (lighter)
        for i in range(1, count + 1):
            factor = i / (count + 1)
            tint_r = int(r + (255 - r) * factor)
            tint_g = int(g + (255 - g) * factor)
            tint_b = int(b + (255 - b) * factor)
            tints.append(f"#{tint_r:02x}{tint_g:02x}{tint_b:02x}")
        
        return {
            "shades": shades,
            "tints": tints
        }
    
    def validate_json(self, json_string: str) -> dict:
        """Validate and format JSON."""
        try:
            parsed = json.loads(json_string)
            formatted = json.dumps(parsed, indent=2, sort_keys=True)
            return {
                "valid": True,
                "formatted": formatted,
                "error": None
            }
        except json.JSONDecodeError as e:
            return {
                "valid": False,
                "formatted": None,
                "error": str(e)
            }
    
    def diff_json(self, json1: str, json2: str) -> dict:
        """Compare two JSON objects."""
        try:
            obj1 = json.loads(json1)
            obj2 = json.loads(json2)
        except json.JSONDecodeError as e:
            raise ValidationError(f"Invalid JSON: {str(e)}")
        
        added = {}
        removed = {}
        modified = {}
        
        # Simple diff (works for flat objects)
        if isinstance(obj1, dict) and isinstance(obj2, dict):
            keys1 = set(obj1.keys())
            keys2 = set(obj2.keys())
            
            # Added keys
            for key in keys2 - keys1:
                added[key] = obj2[key]
            
            # Removed keys
            for key in keys1 - keys2:
                removed[key] = obj1[key]
            
            # Modified keys
            for key in keys1 & keys2:
                if obj1[key] != obj2[key]:
                    modified[key] = {"old": obj1[key], "new": obj2[key]}
        
        return {
            "added": added,
            "removed": removed,
            "modified": modified
        }
    
    def csv_to_json(self, csv_content: str) -> list[dict]:
        """Convert CSV to JSON."""
        import csv
        from io import StringIO
        
        reader = csv.DictReader(StringIO(csv_content))
        return list(reader)


# Singleton instance
utils_service = UtilsService()
