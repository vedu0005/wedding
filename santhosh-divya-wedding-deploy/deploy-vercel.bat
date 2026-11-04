@echo off
title Deploy Santhosh & Divya Wedding Invitation (Permanent Link)
color 0B
echo ======================================================================
echo   DEPLOY SANTHOSH & DIVYA WEDDING INVITATION (FREE FOREVER - NO EXPIRY)
echo ======================================================================
echo.
echo  This tool creates a 100%% permanent link with NO EXPIRATION DATE.
echo.
cd /d "%~dp0"
echo  Starting deployment to Vercel...
echo  (If prompted, press Enter to open your browser and click "Continue with Google")
echo.
call npx.cmd --yes vercel --prod --yes
echo.
echo ======================================================================
echo   DEPLOYMENT COMPLETE!
echo   Copy the permanent "Production: https://..." link above.
echo   You can share it with all family and friends on WhatsApp/SMS!
echo ======================================================================
echo.
pause
