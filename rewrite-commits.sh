#!/bin/bash
# Natural commit messages script

FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --msg-filter '
read msg
case "$msg" in
  "Remove all emojis from project files for professional appearance")
    echo "cleaned up emojis, looks much better now"
    ;;
  "Add .env.example, LICENSE, and update README with complete setup instructions")
    echo "added env example and license, updated readme"
    ;;
  "Remove transitions from progress report stats")
    echo "fixed progress report animations"
    ;;
  "Remove transitions from dashboard stats - instant display")
    echo "dashboard stats now show instantly"
    ;;
  "Remove all transitions from People page stats - instant display")
    echo "removed those annoying transitions"
    ;;
  "Fix CSS and JS paths for mobile menu on all pages")
    echo "fixed mobile menu paths on all pages"
    ;;
  "Fix mobile navigation button visibility and positioning")
    echo "mobile nav button working now"
    ;;
  "Add clear-database script and cleared all database data")
    echo "added script to clear database"
    ;;
  "Ensure no automatic dummy data - updated README and gitignore")
    echo "updated readme and gitignore"
    ;;
  "Remove unnecessary documentation files and used scripts")
    echo "deleted some old files"
    ;;
  "Remove dummy data from profile pages - now shows real logged-in user data")
    echo "profile now shows real user data"
    ;;
  *)
    echo "$msg"
    ;;
esac
' HEAD
