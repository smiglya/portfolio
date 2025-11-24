@echo off
cd /d C:\Portfolio

echo Configuring git user...
git config user.email "petr.artemov.06@gmail.com"
git config user.name "Smiglya"

echo Adding all files...
git add -A

echo Creating commit...
git commit -m "Update: contacts, skills (Linux, Cybersecurity), portfolio analyzer, mobile responsive design"

echo Pushing to GitHub...
git push origin main --force

echo.
echo Done! All files pushed to GitHub.
pause

