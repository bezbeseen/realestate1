#!/bin/bash

# Create LaunchAgents directory if it doesn't exist
mkdir -p ~/Library/LaunchAgents

# Copy the plist file to LaunchAgents
cp com.realestate1.server.plist ~/Library/LaunchAgents/

# Load the launch agent
launchctl load ~/Library/LaunchAgents/com.realestate1.server.plist

echo "Server has been installed as a launch agent and will start automatically on login." 