# Multidisciplinary_Project_Sem_232
Đây là repo cho môn Thực tập đồ án môn học đa ngành - hướng Công nghệ phần mềm HK232.

## Setup thư viện trước khi khởi chạy project lần đầu
Mở terminal/powershell tại thư mục gốc của project, thực hiện gõ các lệnh sau đây để cài thư viện cho backend:
```
cd server
pip install requirement.txt
```
Sau đó, quay ra thư mục gốc và cài thư viện cho web (frontend):
```
cd ../web
npm i
```
Tiếp theo, cần thiết lập biến môi trường `.env` cho server. Vào thư mục server, tạo file mới không tên với phần mở rộng là `.env`. Sau đó, mở file `.env_example` và sao chép nội dung vào file `.env` vừa tạo. Thay thế chuỗi rỗng của `ADA_USER` và `ADA_KEY` trong file `.env` vừa được chép nội dung với thông tin đã được gửi trên group nhóm.

Cuối cùng, cần cài đặt chứng chỉ bảo mật để đảm bảo có thể xác thực được với Mongo Atlas. Tham khảo cách làm cũng như lý do cần cài đặt tại đây: [StackOverflow](https://stackoverflow.com/questions/69397039/pymongo-ssl-certificate-verify-failed-certificate-has-expired-on-mongo-atlas)

Lưu ý, bước cài đặt chứng chỉ này có thể là không bắt buộc vì không phải máy nào cũng bị thiếu.

Nếu ở backend, sau khi cài xong mà vẫn thiếu thư viện, vui lòng tự cài đặt các thư viện thiếu, sau đó cập nhật vào file `requirement.txt`.

## Khởi chạy project
Cần khởi chạy cả backend và frontend. Nên mở cùng lúc hai terminal riêng biệt vì cả hai đều chạy đồng thời.

Đối với backend:
```
py app.py
```
Đối với frontend:
```
npm run start
```

Hiện tại, chưa kịp hiện thực phần đăng ký, do đó để đăng nhập vào web, sử dụng tài khoản `nghia` với mật khẩu `23571113`.

## Công nghệ sử dụng
- IOT connect: AdafruitIO
- Database: MongoDB
- Backend: Flask
- Frontend: ReactJS, Redux Toolkit, BootstrapCSS
