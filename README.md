# Phân tích và mô tả use case

**Use Case:** Đăng ký tài khoản trên ứng dụng di động

**- UI**:

![Sign up](https://github.com/user-attachments/assets/941bdebc-7e1c-41e2-a146-a83083705df6)
![Verify](https://github.com/user-attachments/assets/15a2cf9c-8fbf-4a6f-9901-5704242c47c3)

**- Actor(s)**: Guest
**- Short Description**: Người dùng đăng ký tài khoản trên ứng dụng di động để bắt đầu sử dụng các tính năng của ứng dụng.
**- Pre-conditions**: Người dùng chưa có tài khoản trên hệ thống.
**- Post-conditions**: Tài khoản được tạo thành công và người dùng có thể đăng nhập để sử dụng ứng dụng.
**- Main Flow**:
1. Người dùng mở ứng dụng và chọn **Đăng ký**.
2. Người dùng nhập thông tin cá nhân bao gồm:
   - Email
   - Mật khẩu
   - Họ và tên
   - Ngày, tháng, năm sinh
3. Hệ thống gửi mã **OTP** qua email của người dùng.
4. Người dùng nhập mã OTP để xác thực.
5. Hệ thống tạo tài khoản mới và chuyển người dùng sang trang **Đăng nhập**.

**- Alternative Flow:**
- **Trường hợp 1: Người dùng không nhận được OTP**
  - Người dùng chọn tùy chọn "Gửi lại OTP".
  - Hệ thống gửi lại mã OTP qua email.
- **Trường hợp 2: Email đã tồn tại**
  - Hệ thống hiển thị thông báo lỗi: *"Email này đã được sử dụng, vui lòng chọn email khác."*

**- Exception Flow:**
- **Lỗi mạng hoặc hệ thống**
  - Hệ thống hiển thị thông báo lỗi: *"Có lỗi xảy ra, vui lòng thử lại sau."*

**- Use Case:** Đăng nhập

**- UI:**

![Sign in](https://github.com/user-attachments/assets/84a0a5e3-7d78-4f13-9fd8-b700374f3cdb)

**- Actor(s)**: User
**- Short Description**: Người dùng đăng nhập vào ứng dụng di động để truy cập các tính năng của ứng dụng.  
**- Pre-conditions**: Tài khoản phải tồn tại và thông tin đăng nhập (email và mật khẩu) phải chính xác.  
**- Post-conditions**: Người dùng truy cập thành công vào ứng dụng và có thể sử dụng các chức năng.  
**- Main Flow**:  
1. Người dùng mở ứng dụng và chọn **Đăng nhập**.  
2. Người dùng nhập thông tin đăng nhập:  
   - Email  
   - Mật khẩu  
3. Hệ thống kiểm tra thông tin đăng nhập trong cơ sở dữ liệu.  
4. Nếu thông tin đúng, hệ thống cho phép người dùng truy cập vào ứng dụng.  
**- Alternative Flow**:  
- **Trường hợp 1: Người dùng quên mật khẩu**  
  - Người dùng chọn tùy chọn "Quên mật khẩu".  
  - Hệ thống chuyển hướng đến chức năng khôi phục mật khẩu.

**- Exception Flow**:  
- **Trường hợp 1: Sai email hoặc mật khẩu**  
  - Hệ thống hiển thị thông báo lỗi: *"Email hoặc mật khẩu không đúng, vui lòng thử lại."*  
- **Trường hợp 2: Tài khoản bị khóa**  
  - Hệ thống hiển thị thông báo lỗi: *"Tài khoản của bạn đã bị khóa, vui lòng liên hệ hỗ trợ."*

**- Use Case:** Quên mật khẩu

**- UI:**

![Forgot Password](https://github.com/user-attachments/assets/5710e6fb-1fbf-4172-a9d8-8572ef2dd09a)
![Reset Password](https://github.com/user-attachments/assets/f455bc1e-eb54-40f3-81e8-d59727b66271)

**- Actor(s)**: User  
**- Short Description**: Người dùng đặt lại mật khẩu qua email để khôi phục quyền truy cập tài khoản.  
**- Pre-conditions**: Tài khoản phải tồn tại trong hệ thống.  
**- Post-conditions**: Người dùng có thể đăng nhập với mật khẩu mới sau khi đặt lại thành công.  
**- Main Flow**:
1. Người dùng chọn chức năng **Quên mật khẩu**.  
2. Người dùng nhập email.  
3. Hệ thống gửi mã **OTP** qua email để đặt lại mật khẩu.  
4. Người dùng nhập mã OTP và thiết lập mật khẩu mới.  
5. Hệ thống cập nhật mật khẩu thành công và chuyển hướng người dùng đến màn hình **Đăng nhập**.

**- Alternative Flow**:
- **Trường hợp 1: Người dùng không nhận được OTP**
  - Người dùng chọn tùy chọn "Gửi lại OTP".
  - Hệ thống gửi lại mã OTP qua email.

**- Exception Flow**:
- **Trường hợp 1: Email không tồn tại**
  - Hệ thống hiển thị thông báo lỗi: *"Email này không tồn tại trong hệ thống, vui lòng kiểm tra lại."*

**- Use Case:** Xem trang chủ

**- UI:**

![Main](https://github.com/user-attachments/assets/48a5e16b-0604-4295-b071-eebc47e5928c)

**- Actor(s)**: Guest, User
**- Short Description**: Người dùng truy cập vào trang chủ để xem các sản phẩm nổi bật và thông tin liên quan.  
**- Pre-conditions**: Người dùng đã đăng nhập vào ứng dụng.  
**- Post-conditions**: Người dùng có thể tiếp tục duyệt sản phẩm hoặc thực hiện các hành động khác trong ứng dụng.  
**- Main Flow**:  
1. Người dùng mở ứng dụng và vào **Trang chủ**.  
2. Hệ thống hiển thị danh sách:  
   - Các danh mục  
   - Sản phẩm nổi bật  
   - Khuyến mãi  
3. Người dùng có thể:  
   - Chọn sản phẩm để xem chi tiết.  
   - Sử dụng thanh tìm kiếm để tìm sản phẩm khác.  
**- Alternative Flow**:  
- **Trường hợp 1: Người dùng không có hành động nào**  
  - Người dùng không tương tác và thoát khỏi ứng dụng.  
**- Exception Flow**:  
- **Trường hợp 1: Mất kết nối mạng**  
  - Hệ thống hiển thị thông báo lỗi: *"Không có kết nối mạng, vui lòng kiểm tra lại."*

**Use Case:** Xem danh mục sản phẩm

**- UI:**

![Catalog](https://github.com/user-attachments/assets/9f0e7470-99b2-4ab4-ae80-99fde757b19d)

**- Actor(s)**: Guest, User  
**- Short Description**: Người dùng xem danh mục sản phẩm có trên ứng dụng để duyệt các sản phẩm theo nhóm.  
**- Pre-conditions**: Danh mục sản phẩm phải tồn tại trong hệ thống.  
**- Post-conditions**: Người dùng xem được các sản phẩm có trong danh mục đã chọn.  
**- Main Flow**:  
1. Người dùng chọn mục **Danh mục**.  
2. Hệ thống hiển thị danh sách các danh mục sản phẩm.  
3. Người dùng chọn một danh mục để xem danh sách sản phẩm thuộc danh mục đó.

**- Alternative Flow**:  
- (Không có trường hợp thay thế được chỉ định).
 
**- Exception Flow**:
- **Trường hợp 1: Lỗi kết nối**  
  - Hệ thống hiển thị thông báo lỗi: *"Lỗi kết nối, vui lòng kiểm tra lại mạng."*  
