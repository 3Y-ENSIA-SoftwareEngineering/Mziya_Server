@echo off
echo Installing root dependencies...
call npm install

echo Installing backend dependencies...
cd backend
call npm install
call npm install nodemon --save-dev
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
call npm install react-scripts --save-dev
cd ..

echo Checking global dependencies...
call npm install -g nodemon
call npm install -g npm-run-all

echo All dependencies installed successfully!
echo To start the application, run 'npm start'
pause