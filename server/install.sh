npm install
sudo cp ./paint.service /etc/systemd/system/paint.service
sudo systemctl daemon-reload
sudo systemctl enable paint
sudo systemctl restart paint
