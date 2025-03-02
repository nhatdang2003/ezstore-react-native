# Phân tích và mô tả Use Case

## Use Case: Đăng ký tài khoản

### UI:

![Sign up](https://github.com/user-attachments/assets/6c4995b8-0f1e-4b37-8be6-89919bed09e3)
![Verify](https://github.com/user-attachments/assets/7aa817f5-c2fb-4258-8f51-6667d70f9fdd)

**Actor(s):** Guest  
**Short Description:** Người dùng đăng ký tài khoản trên ứng dụng di động để bắt đầu sử dụng các tính năng của ứng dụng.  
**Pre-conditions:** Người dùng chưa có tài khoản trên hệ thống.  
**Post-conditions:** Tài khoản được tạo thành công và người dùng có thể sử dụng trên ứng dụng.  

### Main Flow:
1. Người dùng mở ứng dụng và chọn **Đăng ký**.  
2. Người dùng nhập thông tin cá nhân bao gồm:  
   - Email  
   - Mật khẩu  
   - Họ và tên  
   - Ngày, tháng, năm sinh  
3. Hệ thống gửi mã **OTP** qua email.  
4. Người dùng nhập mã OTP để xác thực.  
5. Hệ thống tạo tài khoản và chuyển người dùng sang trang **Đăng nhập**.  

### Alternative Flow:
- **Trường hợp 1: Người dùng không nhận được OTP**  
  - Người dùng chọn tùy chọn "Gửi lại OTP".  
  - Hệ thống gửi lại mã OTP qua email.  
- **Trường hợp 2: Email đã tồn tại**  
  - Hệ thống hiển thị thông báo lỗi: "Email này đã tồn tại, vui lòng chọn email khác."  

### Exception Flow:
- **Trường hợp 1: Lỗi mạng hoặc hệ thống**  
  - Hệ thống hiển thị thông báo lỗi: "Có lỗi mạng hoặc hệ thống, vui lòng thử lại sau."  

---

## Use Case: Đăng nhập

### UI:

![Sign in (1)](https://github.com/user-attachments/assets/840a0eba-c255-4e2b-8f41-39cafb557b0c)

**Actor(s):** User  
**Short Description:** Người dùng đăng nhập vào ứng dụng di động để truy cập các tính năng của ứng dụng.  
**Pre-conditions:** Tài khoản phải tồn tại và thông tin đăng nhập (email và mật khẩu) phải đúng.  
**Post-conditions:** Người dùng truy cập vào ứng dụng thành công.  

### Main Flow:
1. Người dùng mở ứng dụng và chọn **Đăng nhập**.  
2. Người dùng nhập:  
   - Email  
   - Mật khẩu  
3. Hệ thống kiểm tra thông tin đăng nhập.  
4. Nếu thông tin đúng, hệ thống cho phép truy cập vào ứng dụng.  

### Alternative Flow:
- **Trường hợp 1: Người dùng quên mật khẩu**  
  - Người dùng chọn "Quên mật khẩu".  
  - Hệ thống chuyển hướng đến chức năng **Quên mật khẩu**.  

### Exception Flow:
- **Trường hợp 1: Sai email hoặc mật khẩu**  
  - Hệ thống hiển thị thông báo lỗi: "Email hoặc mật khẩu không đúng, vui lòng thử lại."  
- **Trường hợp 2: Tài khoản bị khóa**  
  - Hệ thống hiển thị thông báo lỗi: "Tài khoản của bạn đã bị khóa, vui lòng liên hệ hỗ trợ."  

---

## Use Case: Quên mật khẩu

### UI:

![Forgot Password](https://github.com/user-attachments/assets/078a3c20-733a-4754-9358-e6659b237dca)
![Reset Password](https://github.com/user-attachments/assets/77338fe0-e42b-49dc-b49e-b5be94077b08)

**Actor(s):** User  
**Short Description:** Người dùng đặt lại mật khẩu qua email để khôi phục quyền truy cập tài khoản.  
**Pre-conditions:** Tài khoản phải tồn tại trong hệ thống.  
**Post-conditions:** Người dùng có thể đăng nhập với mật khẩu mới sau khi đặt lại thành công.  

### Main Flow:
1. Người dùng chọn chức năng **Quên mật khẩu**.  
2. Người dùng nhập email.  
3. Hệ thống gửi mã **OTP** để đặt lại mật khẩu qua email.  
4. Người dùng nhập mã OTP và thiết lập mật khẩu mới.  
5. Hệ thống cập nhật mật khẩu thành công và chuyển hướng người dùng đến màn hình **Đăng nhập**.  

### Alternative Flow:
- **Trường hợp 1: Người dùng không nhận được OTP**  
  - Người dùng chọn tùy chọn "Gửi lại OTP".  
  - Hệ thống gửi lại mã OTP qua email.  

### Exception Flow:
- **Trường hợp 1: Email không tồn tại**  
  - Hệ thống hiển thị thông báo lỗi: "Email này không tồn tại trong hệ thống, vui lòng kiểm tra lại."  

---

## Use Case: Xem trang chủ

### UI:

![Main](https://github.com/user-attachments/assets/05dcf695-7631-43ad-8ee7-8aad4aa2acec)

**Actor(s):** Guest, User  
**Short Description:** Người dùng truy cập vào trang chủ để xem các sản phẩm nổi bật và thông tin liên quan.  
**Pre-conditions:** Người dùng đã đăng nhập (đối với User) hoặc truy cập mà không cần đăng nhập (đối với Guest).  
**Post-conditions:** Người dùng có thể tiếp tục duyệt sản phẩm hoặc thực hiện các hành động khác trong ứng dụng.  

### Main Flow:
1. Người dùng mở ứng dụng và vào **Trang chủ**.  
2. Hệ thống hiển thị danh sách:  
   - Các danh mục  
   - Sản phẩm nổi bật  
   - Khuyến mãi  
3. Người dùng có thể:  
   - Chọn sản phẩm để xem chi tiết.  
   - Sử dụng thanh tìm kiếm để tìm sản phẩm khác.  

### Alternative Flow:
- **Trường hợp 1: Người dùng không có hành động nào**  
  - Người dùng không tương tác và thoát khỏi ứng dụng.  

### Exception Flow:
- **Trường hợp 1: Mất kết nối mạng**  
  - Hệ thống hiển thị thông báo lỗi: "Không có kết nối mạng, vui lòng kiểm tra lại."  

---

## Use Case: Xem danh mục sản phẩm

### UI:

![Catalog](https://github.com/user-attachments/assets/1713b6da-ba73-45cb-88fa-4cca5e78ec9a)

**Actor(s):** Guest, User  
**Short Description:** Người dùng xem danh mục sản phẩm có trên ứng dụng để duyệt các sản phẩm theo nhóm.  
**Pre-conditions:** Danh mục sản phẩm phải tồn tại trong hệ thống.  
**Post-conditions:** Người dùng xem được các sản phẩm có trong danh mục đã chọn.  

### Main Flow:
1. Người dùng chọn mục **Danh mục**.  
2. Hệ thống hiển thị danh sách các danh mục sản phẩm.  
3. Người dùng chọn một danh mục để xem danh sách sản phẩm thuộc danh mục đó.  

### Exception Flow:
- **Trường hợp 1: Lỗi kết nối**  
  - Hệ thống hiển thị thông báo lỗi: "Lỗi kết nối, vui lòng kiểm tra lại mạng."

## Use Case: Xem sản phẩm

### UI:

![Product](https://github.com/user-attachments/assets/e9ff1589-bb91-4f7d-ba3c-21d9ac69233e)

**Actor(s):** Guest, User  
**Short Description:** Người dùng xem toàn bộ sản phẩm của cửa hàng.  
**Pre-conditions:** Cửa hàng có sản phẩm.  
**Post-conditions:** Người dùng có thể xem toàn bộ các sản phẩm mà cửa hàng có.  

### Main Flow:
1. Người dùng vào tab **Sản phẩm**.  
2. Hệ thống hiển thị toàn bộ các sản phẩm.  

### Alternative Flow:
- Người dùng có thể sử dụng bộ lọc hoặc sắp xếp để tìm kiếm các sản phẩm theo nhu cầu.  

### Exception Flow:
- **Trường hợp 1: Lỗi tải dữ liệu**  
  - Hệ thống hiển thị thông báo lỗi.  

---

## Use Case: Lọc sản phẩm

### UI:

![Filters (1)](https://github.com/user-attachments/assets/bd1412cd-b04f-4a60-b5d3-c1b729fddaad)

**Actor(s):** Guest, User  
**Short Description:** Người dùng sử dụng bộ lọc để tìm ra các sản phẩm theo tiêu chí mong muốn.  
**Pre-conditions:** Cửa hàng có sản phẩm và người dùng ở tab **Sản phẩm**.  
**Post-conditions:** Hệ thống hiển thị các sản phẩm theo tiêu chí của người dùng.  

### Main Flow:
1. Người dùng nhấn nút **Bộ lọc**.  
2. Chọn các tiêu chí để lọc (danh mục, kích thước, màu sắc, giá tiền, đánh giá, …).  
3. Hệ thống hiển thị danh sách các sản phẩm theo bộ lọc người dùng đã chọn.  

### Alternative Flow:
- Người dùng có thể nhấn nút **Đặt lại** để bỏ chọn toàn bộ các tiêu chí lọc.  
- Người dùng có thể nhấn nút **Hủy** để xóa bộ lọc hiện tại.  

### Exception Flow:
- **Trường hợp 1: Lỗi tải dữ liệu**  
  - Hệ thống hiển thị thông báo lỗi.  

---

## Use Case: Xem chi tiết sản phẩm

### UI:

![Product Details](https://github.com/user-attachments/assets/7da73b1c-a5fa-459f-a766-73fbced2511e)

**Actor(s):** Guest, User  
**Short Description:** Người dùng xem thông tin chi tiết của một sản phẩm.  
**Pre-conditions:** Sản phẩm phải tồn tại trong hệ thống.  
**Post-conditions:** Người dùng có thể xem hình ảnh, mô tả, kích thước, màu sắc, giá cả, đánh giá sản phẩm và thêm sản phẩm vào giỏ hàng.  

### Main Flow:
1. Người dùng chọn một sản phẩm từ danh sách.  
2. Hệ thống hiển thị thông tin chi tiết sản phẩm.  

### Alternative Flow:
- Người dùng quay lại trang trước.
- Người dùng chọn các sản phẩm có liên quan.

### Exception Flow:
- **Trường hợp 1: Lỗi tải dữ liệu**  
  - Hệ thống hiển thị thông báo lỗi.  

