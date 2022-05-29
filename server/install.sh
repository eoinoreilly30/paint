npm install
sudo cp ./grid-paint.service /etc/systemd/system/grid-paint.service
sudo systemctl daemon-reload
sudo systemctl enable grid-paint
sudo systemctl restart grid-paint
