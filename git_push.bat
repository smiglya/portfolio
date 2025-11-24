@echo off
cd /d C:\Portfolio

echo Configuring git user...
git config user.email "petr.artemov.06@gmail.com"
git config user.name "Smiglya"

echo Adding all files...
git add .

echo Creating commit...
git commit -m "Update contact info and add new skills (Linux, Cybersecurity, Portfolio Analyzer)"

echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo Done! Press any key to exit...
pause
