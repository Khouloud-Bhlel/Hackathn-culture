# GitHub Actions Deployment Guide

This document explains how to use the GitHub Actions workflows for automated deployment and versioning of the Museum Culture application.

## Available Workflows

### 1. Deploy to Vercel (`deploy.yml`)

This workflow handles deployment to Vercel environments:

- **Automatic deployments**: Triggered on pushes to the main/master branch
- **Preview deployments**: For pull requests
- **Manual deployments**: Can be triggered manually with options for environment and version tag

### 2. Create Release and Tag (`release.yml`)

This workflow creates new versions of the application:

- **Bump version**: Automatically updates the version number in package.json
- **Create tag**: Adds a Git tag for the new version
- **Create GitHub Release**: Creates a formal GitHub release

## Required Secrets

To use these workflows, you need to add the following secrets to your GitHub repository:

1. `VERCEL_TOKEN`: Your Vercel authentication token
2. `OPENAI_API_KEY`: A standard OpenAI API key (starting with `sk-`, not `sk-proj-`)

## How to Add Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add the required secrets

## How to Get the Required Secrets

### Vercel Token

1. Log in to your Vercel account
2. Go to Settings → Tokens
3. Create a new token with appropriate permissions

### OpenAI API Key

1. Log in to your OpenAI account
2. Go to https://platform.openai.com/api-keys
3. Create a new secret key (make sure it's a standard key, not project-scoped)

## Manual Deployment

To trigger a manual deployment:

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select the "Deploy to Vercel" workflow
4. Click "Run workflow"
5. Choose the environment (preview or production)
6. Optionally add a version tag (e.g., v1.0.1)
7. Click "Run workflow"

## Creating a New Release

To create a new version and release:

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select the "Create Release and Tag" workflow
4. Click "Run workflow"
5. Choose the version bump type (patch, minor, or major)
6. Click "Run workflow"

This will update the version in package.json, create a tag, and publish a GitHub release.
