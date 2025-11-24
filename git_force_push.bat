@echo off
cd /d C:\Portfolio

echo Aborting any pending merges...
git merge --abort 2>nul

echo Resetting to clean state...
git reset --hard HEAD

echo Configuring git user...
git config user.email "petr.artemov.06@gmail.com"
git config user.name "Smiglya"

echo Adding all files...
git add .

echo Creating commit if needed...
git diff-index --quiet HEAD || git commit -m "Update contact info and add new skills (Linux, Cybersecurity, Portfolio Analyzer)"

echo Force pushing to GitHub (will overwrite remote)...
git push origin main --force

echo.
echo Successfully pushed! Press any key to exit...
pause

