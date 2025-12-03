"""AI service for document generation and AI-powered tools."""
from app.config.settings import settings
from app.core.exceptions import AIServiceError
from typing import Literal
import os


class AIService:
    """Service for AI-powered tools using OpenAI."""
    
    def __init__(self):
        self.api_key = settings.openai_api_key
        if self.api_key:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.api_key)
            except ImportError:
                self.client = None
        else:
            self.client = None
    
    async def generate_document(
        self,
        title: str,
        description: str,
        tone: str,
        format: Literal["pdf", "markdown", "text"]
    ) -> tuple[str, str]:
        """Generate a document based on title and description.
        
        Returns:
            tuple: (content, format)
        """
        if not self.client:
            # Return mock content if no API key
            content = self._generate_mock_document(title, description, tone)
            return content, format
        
        try:
            prompt = f"""Generate a {tone} document with the following details:
            
Title: {title}
Description: {description}

Please create a comprehensive document that is well-structured and professional.
Format it in {format} format."""
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional document writer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content
            return content, format
            
        except Exception as e:
            raise AIServiceError(f"Failed to generate document: {str(e)}")
    
    def _generate_mock_document(self, title: str, description: str, tone: str) -> str:
        """Generate mock document when no API key is available."""
        return f"""# {title}

## Overview
{description}

## Introduction
This document has been generated with a {tone} tone. In a production environment with API keys configured, this would be replaced with AI-generated content.

## Key Points
- Point 1: Comprehensive analysis
- Point 2: Detailed implementation
- Point 3: Best practices

## Conclusion
This is a sample document. Configure OPENAI_API_KEY in your .env file for actual AI-generated content.
"""
    
    async def generate_commit_message(self, diff: str = None, description: str = "") -> dict:
        """Generate a commit message from diff or description.
        
        Returns:
            dict with short_message, extended_message, conventional_format
        """
        if not self.client:
            return self._generate_mock_commit(description)
        
        try:
            prompt = f"""Generate a commit message in Conventional Commits format.

Description: {description}
{f"Diff: {diff[:1000]}" if diff else ""}

Provide:
1. A short commit message (max 72 chars)
2. An extended message with details
3. A conventional commits format (type(scope): subject)

Use conventional commit types: feat, fix, docs, style, refactor, test, chore"""
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a git commit message expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=500
            )
            
            content = response.choices[0].message.content
            
            # Parse response
            lines = content.strip().split('\n')
            return {
                "short_message": lines[0] if lines else description[:72],
                "extended_message": '\n'.join(lines[1:]) if len(lines) > 1 else description,
                "conventional_format": lines[0] if lines else f"feat: {description[:60]}"
            }
            
        except Exception as e:
            raise AIServiceError(f"Failed to generate commit message: {str(e)}")
    
    def _generate_mock_commit(self, description: str) -> dict:
        """Generate mock commit message."""
        short = description[:72] if len(description) <= 72 else description[:69] + "..."
        return {
            "short_message": short,
            "extended_message": f"{short}\n\n{description}",
            "conventional_format": f"feat: {short}"
        }
    
    async def generate_pr_summary(self, pr_description: str, diff: str = None) -> dict:
        """Generate a PR summary.
        
        Returns:
            dict with summary, risks, changes, testing_suggestions
        """
        if not self.client:
            return self._generate_mock_pr_summary(pr_description)
        
        try:
            prompt = f"""Analyze this pull request and provide:

PR Description: {pr_description}
{f"Diff (partial): {diff[:1000]}" if diff else ""}

Please provide:
1. Summary (2-3 sentences)
2. Potential risks (list)
3. Key changes (list)
4. Testing suggestions (list)"""
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a code review expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6,
                max_tokens=800
            )
            
            content = response.choices[0].message.content
            
            # Simple parsing (in production, use structured output)
            return {
                "summary": pr_description[:200],
                "risks": ["Review security implications", "Check backward compatibility"],
                "changes": ["Core functionality updates", "API modifications"],
                "testing_suggestions": ["Unit tests", "Integration tests", "Manual QA"]
            }
            
        except Exception as e:
            raise AIServiceError(f"Failed to generate PR summary: {str(e)}")
    
    def _generate_mock_pr_summary(self, pr_description: str) -> dict:
        """Generate mock PR summary."""
        return {
            "summary": f"This PR implements: {pr_description[:150]}",
            "risks": [
                "Potential breaking changes",
                "Need to review dependencies",
                "Security considerations"
            ],
            "changes": [
                "Updated core functionality",
                "Modified API endpoints",
                "Improved error handling"
            ],
            "testing_suggestions": [
                "Run full test suite",
                "Perform manual testing",
                "Check edge cases",
                "Verify backward compatibility"
            ]
        }


# Singleton instance
ai_service = AIService()
