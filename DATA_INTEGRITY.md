# NGUYÊN TẮC TOÀN VẸN DỮ LIỆU (DATA INTEGRITY PRINCIPLES)

Dự án tuân thủ nghiêm ngặt các nguyên tắc sau đây để đảm bảo tính trung thực và khách quan của kết quả khảo sát:

## 1. Tính Bất Biến của Dữ liệu (Immutability)
- **Không sửa đổi:** Tuyệt đối không thay đổi điểm số (ratings) hoặc nội dung phản hồi (comments) của người dân sau khi đã gửi.
- **Bảo vệ bằng Rule:** Hệ thống Firebase Security Rules được thiết lập để ngăn chặn mọi hành vi `update` hoặc `delete` đối với các bản ghi khảo sát gốc.

## 2. Tính Xác Thực (Authenticity)
- **Nguồn dữ liệu:** 100% số liệu trên Dashboard được truy vấn trực tiếp từ Firestore.
- **Không dữ liệu giả:** Nghiêm cấm tạo khảo sát giả, dữ liệu demo hoặc dữ liệu dự đoán để làm đẹp báo cáo.
- **Giá trị gốc:** Mọi điểm số phải giữ nguyên giá trị người dân đã chọn (1-5 sao).

## 3. Vai trò của Trí tuệ Nhân tạo (AI Role)
- **Không can thiệp kết quả:** AI không được phép tự đưa ra quyết định, dự đoán hoặc thay đổi kết quả khảo sát.
- **Phạm vi hỗ trợ:** AI chỉ được sử dụng để hỗ trợ lập trình, tối ưu giao diện và phân tích dữ liệu khi có yêu cầu chủ động từ quản trị viên.

## 4. Minh bạch Thống kê (Statistical Transparency)
- **Công thức rõ ràng:** Các phép tính trung bình, tỷ lệ phần trăm được thực hiện bằng mã nguồn minh bạch (`src/utils/stats.ts`), không dùng các thuật toán "hộp đen".
- **Xử lý dữ liệu rỗng:** Khi không có dữ liệu, hệ thống hiển thị trạng thái trống (Empty State) thay vì tự điền giá trị giả định.

---
*Lấy sự hài lòng của người dân làm thước đo - Đảm bảo sự trung thực trên từng con số.*
