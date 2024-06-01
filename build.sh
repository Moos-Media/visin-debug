npm run build
mv build debugpage
cd ..
cd visin-server
rm  -r debugpage 
cd ..
cp -r visin-debug/debugpage visin-server
echo "DONE"