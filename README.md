## Use Case: Đăng ký tài khoản trên ứng dụng di động

### UI:
![Sign up](https://github.com/user-attachments/assets/941bdebc-7e1c-41e2-a146-a83083705df6)


### Actor(s)
- **Guest**: Người dùng chưa đăng nhập hoặc chưa có tài khoản.

### Short Description
Người dùng đăng ký tài khoản trên ứng dụng di động để bắt đầu sử dụng các tính năng của ứng dụng.

### Pre-conditions
- Người dùng chưa có tài khoản trên hệ thống.

### Post-conditions
- Tài khoản được tạo thành công và người dùng có thể đăng nhập để sử dụng ứng dụng.

### Main Flow
1. Người dùng mở ứng dụng và chọn **Đăng ký**.
2. Người dùng nhập thông tin cá nhân bao gồm:
   - Email
   - Mật khẩu
   - Họ và tên
   - Ngày, tháng, năm sinh
3. Hệ thống gửi mã **OTP** qua email của người dùng.
4. Người dùng nhập mã OTP để xác thực.
5. Hệ thống tạo tài khoản mới và chuyển người dùng sang trang **Đăng nhập**.

### Alternative Flow
- **Trường hợp 1: Người dùng không nhận được OTP**
  - Người dùng chọn tùy chọn "Gửi lại OTP".
  - Hệ thống gửi lại mã OTP qua email.
- **Trường hợp 2: Email đã tồn tại**
  - Hệ thống hiển thị thông báo lỗi: *"Email này đã được sử dụng, vui lòng chọn email khác."*

### Exception Flow
- **Lỗi mạng hoặc hệ thống**
  - Hệ thống hiển thị thông báo lỗi: *"Có lỗi xảy ra, vui lòng thử lại sau."*

