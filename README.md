# TÀI LIỆU CẤU TRÚC CƠ SỞ DỮ LIỆU - SMARTCARE BACKEND

> Nguồn: `server/src/models` (MongoDB + Mongoose)

---

## Bảng 1.1. Cấu trúc cơ sở dữ liệu – Collection User

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID duy nhất người dùng |
| name | String | Required | Tên người dùng |
| phone | String | Required, Unique | Số điện thoại đăng nhập |
| passwordHash | String | Required | Mật khẩu đã mã hóa |
| role | String | Required, Enum(PATIENT, CAREGIVER, DOCTOR) | Vai trò tài khoản |
| caregiverId | ObjectId (ref: User) | Optional, Default null | Liên kết người chăm sóc |
| caregiverPhone | String | Optional, Default null | SĐT người chăm sóc |
| email | String | Optional, Default null | Email người dùng |
| isVerified | Boolean | Default false | Trạng thái xác minh |
| medicalCondition | String | Default "Normal" | Tình trạng bệnh nền |
| height | Number | Optional, Default null | Chiều cao |
| weight | Number | Optional, Default null | Cân nặng |
| otpCode | String | Optional, Default null | OTP tạm |
| otpExpiresAt | Date | Optional, Default null | Hết hạn OTP |
| notificationSettings | Embedded Document | Default object | Cấu hình nhắc nhở |
| notificationSettings.medicationReminderBefore | Number | Default 15 | Nhắc thuốc trước (phút) |
| notificationSettings.mealReminderBefore | Number | Default 15 | Nhắc ăn trước (phút) |
| notificationSettings.exerciseReminderBefore | Number | Default 15 | Nhắc tập trước (phút) |
| notificationSettings.medicationEnabled | Boolean | Default true | Bật nhắc thuốc |
| notificationSettings.mealEnabled | Boolean | Default true | Bật nhắc ăn |
| notificationSettings.exerciseEnabled | Boolean | Default true | Bật nhắc tập |
| medicationTimes | Embedded Document | Default object | Khung giờ thuốc mặc định |
| medicationTimes.morning | String | Default "08:00" | Giờ sáng |
| medicationTimes.noon | String | Default "12:00" | Giờ trưa |
| medicationTimes.evening | String | Default "20:00" | Giờ tối |
| avatar | String | Optional, Default null | Ảnh đại diện |
| linkCode | String | Unique, Sparse, Optional | Mã liên kết cố định |
| doctorProfile | Embedded Document | Default object | Hồ sơ bác sĩ |
| doctorProfile.hospital | String | Optional, Default null | Bệnh viện công tác |
| doctorProfile.specialty | String | Optional, Default null | Chuyên khoa |
| doctorProfile.licenseNumber | String | Optional, Default null | Số chứng chỉ hành nghề |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.2. Cấu trúc cơ sở dữ liệu – Collection Otp

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID OTP |
| phone | String | Required, Index | Số điện thoại nhận OTP |
| verificationId | String | Required, Index | ID xác minh từ nhà cung cấp |
| purpose | String | Required, Enum(REGISTER, FORGOT_PASSWORD), Index | Mục đích OTP |
| expireAt | Date | Required, TTL Index | Hết hạn và tự xóa |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |

---

## Bảng 1.3. Cấu trúc cơ sở dữ liệu – Collection AIReport

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID báo cáo AI |
| userId | ObjectId (ref: User) | Required, Index | Người dùng sở hữu báo cáo |
| range | String | Required, Enum(week, month) | Chu kỳ báo cáo |
| medicalCondition | String | Required | Tình trạng bệnh |
| notes | String | Required | Nội dung tóm tắt AI |
| dateKey | String | Required, Index | Khóa ngày (YYYY-MM-DD) |
| expiresAt | Date | Required, TTL Index | Hạn lưu báo cáo |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

**Index bổ sung:**  
- Unique compound: `(userId, range, medicalCondition, dateKey)`

---

## Bảng 1.4. Cấu trúc cơ sở dữ liệu – Collection Alert

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID cảnh báo |
| patientId | ObjectId (ref: User) | Required, Index | Bệnh nhân nhận cảnh báo |
| type | String | Required, Enum(medication, symptom, appointment, sos, fall, medication_missed) | Loại cảnh báo |
| severity | String | Default info, Enum(warning, error, info) | Mức độ |
| title | String | Required | Tiêu đề cảnh báo |
| message | String | Required | Nội dung cảnh báo |
| actionUrl | String | Optional | Điều hướng khi bấm |
| isRead | Boolean | Default false | Trạng thái đã đọc |
| readBy | ObjectId[] (ref: User) | Optional | Danh sách caregiver đã đọc |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.5. Cấu trúc cơ sở dữ liệu – Collection Appointment

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID lịch hẹn |
| userId | ObjectId (ref: User) | Required, Index | Bệnh nhân |
| doctorId | ObjectId (ref: User) | Optional, Default null | Bác sĩ tạo lịch |
| createdByRole | String | Default PATIENT, Enum(PATIENT, CAREGIVER, DOCTOR) | Vai trò tạo lịch |
| doctorName | String | Required | Tên bác sĩ |
| doctorSpecialty | String | Default "" | Chuyên khoa |
| hospitalName | String | Default "" | Cơ sở khám |
| appointmentDate | Date | Required | Ngày hẹn |
| appointmentTime | String | Default "" | Giờ hẹn |
| notes | String | Default "" | Ghi chú |
| reminderBefore | Number | Default 24 | Nhắc trước (giờ) |
| isCompleted | Boolean | Default false | Hoàn thành lịch hẹn |
| notificationId | String | Optional, Default null | ID thông báo |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.6. Cấu trúc cơ sở dữ liệu – Collection CaregiverRequest

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID yêu cầu liên kết |
| patientId | ObjectId (ref: User) | Required, Index | Bệnh nhân gửi yêu cầu |
| caregiverId | ObjectId (ref: User) | Required, Index | Người chăm sóc nhận yêu cầu |
| status | String | Default pending, Enum(pending, accepted, rejected) | Trạng thái xử lý |
| requestedAt | Date | Default now | Thời điểm gửi yêu cầu |
| respondedAt | Date | Optional, Default null | Thời điểm phản hồi |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.7. Cấu trúc cơ sở dữ liệu – Collection CareNote

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID ghi chú chăm sóc |
| patientId | ObjectId (ref: User) | Required, Index | Bệnh nhân |
| caregiverId | ObjectId (ref: User) | Required, Index | Người chăm sóc ghi chú |
| content | String | Required | Nội dung ghi chú |
| tags | String[] | Optional | Nhãn phân loại |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.8. Cấu trúc cơ sở dữ liệu – Collection ChatMessage

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID tin nhắn AI |
| userId | ObjectId (ref: User) | Required, Index | Người dùng chat AI |
| message | String | Required | Câu hỏi người dùng |
| response | String | Required | Phản hồi chatbot |
| sender | String | Required, Enum(user, bot) | Nguồn tin nhắn |
| timestamp | Date | Default now, Index | Thời gian logic chat |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.9. Cấu trúc cơ sở dữ liệu – Collection CustomReminder

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID nhắc việc tùy chỉnh |
| userId | ObjectId (ref: User) | Required, Index | Chủ sở hữu nhắc việc |
| title | String | Required | Tiêu đề |
| description | String | Default "" | Mô tả |
| reminderTime | Date | Required | Thời điểm nhắc |
| repeatType | String | Default NONE, Enum(NONE, DAILY, WEEKLY, MONTHLY) | Kiểu lặp |
| repeatDays | Number[] | Optional | Thứ lặp (0-6) |
| isActive | Boolean | Default true | Trạng thái bật/tắt |
| notificationId | String | Optional, Default null | ID thông báo |
| lastTriggered | Date | Optional, Default null | Lần kích hoạt gần nhất |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.10. Cấu trúc cơ sở dữ liệu – Collection DoctorPatientLink

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID liên kết bác sĩ-bệnh nhân |
| doctorId | ObjectId (ref: User) | Required | Bác sĩ |
| patientId | ObjectId (ref: User) | Required | Bệnh nhân |
| status | String | Default ACTIVE, Enum(ACTIVE, REVOKED) | Trạng thái liên kết |
| expiresAt | Date | Optional, Default null | Hạn quyền truy cập |
| grantedAt | Date | Default now | Thời điểm cấp quyền |
| permissions | Embedded Document | Default object | Quyền truy cập chi tiết |
| permissions.canViewVitals | Boolean | Default true | Xem chỉ số sinh tồn |
| permissions.canViewMedications | Boolean | Default true | Xem thuốc |
| permissions.canPrescribe | Boolean | Default true | Quyền kê đơn |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

**Index bổ sung:**  
- Unique compound: `(doctorId, patientId)`

---

## Bảng 1.11. Cấu trúc cơ sở dữ liệu – Collection DrugCatalog

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID thuốc danh mục |
| name | String | Required, Trim | Tên biệt dược |
| activeIngredient | String | Default "", Trim | Hoạt chất |
| category | String | Default OTHER, Enum | Nhóm thuốc |
| defaultDosage | String | Default "1 viên/lần" | Liều mặc định |
| defaultSessions | String[] | Enum(MORNING, NOON, EVENING) | Buổi dùng mặc định |
| defaultMealTiming | String | Default AFTER_MEAL, Enum(BEFORE_MEAL, AFTER_MEAL) | Uống trước/sau ăn |
| unit | String | Default "viên" | Đơn vị |
| price | Number | Default 0 | Giá/đơn vị |
| stock | Number | Default 0 | Tồn kho |
| contraindications | String | Default "" | Chống chỉ định |
| sideEffects | String | Default "" | Tác dụng phụ |
| notes | String | Default "" | Ghi chú |
| isActive | Boolean | Default true | Trạng thái hoạt động |
| createdBy | ObjectId (ref: User) | Optional | Người tạo |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

**Index bổ sung:**  
- Text index: `name`, `activeIngredient`

---

## Bảng 1.12. Cấu trúc cơ sở dữ liệu – Collection EmergencyContact

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID liên hệ khẩn cấp |
| patientId | ObjectId (ref: User) | Required, Index | Bệnh nhân |
| name | String | Required | Tên liên hệ |
| phone | String | Required | SĐT liên hệ |
| relationship | String | Required | Quan hệ với bệnh nhân |
| isPrimary | Boolean | Default false | Liên hệ chính |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.13. Cấu trúc cơ sở dữ liệu – Collection HealthLog

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID nhật ký sức khỏe |
| userId | ObjectId (ref: User) | Required, Index | Người dùng |
| date | Date | Required | Ngày ghi nhận |
| type | String | Required, Enum(meal, exercise, symptom) | Loại log |
| scheduledDate | Date | Optional | Ngày dự kiến thực hiện |
| scheduledTime | String | Optional | Giờ dự kiến |
| isCompleted | Boolean | Default false | Trạng thái hoàn thành |
| notificationIds | String[] | Default [] | Danh sách notification IDs |
| details | Embedded Document | Optional | Chi tiết theo loại log |
| details.foodName | String | Optional | Tên món ăn |
| details.calories | Number | Optional | Calories nạp vào |
| details.exerciseType | String | Optional | Loại vận động |
| details.durationMinutes | Number | Optional | Thời lượng vận động |
| details.caloriesBurned | Number | Optional | Calories tiêu hao |
| details.symptomName | String | Optional | Tên triệu chứng |
| details.severity | Number | Optional | Mức độ |
| details.note | String | Optional | Ghi chú |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.14. Cấu trúc cơ sở dữ liệu – Collection Link

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID mã liên kết tạm |
| code | String | Required, Unique | Mã liên kết |
| patientId | ObjectId (ref: User) | Required | Bệnh nhân tạo mã |
| expiresAt | Date | Required | Hạn dùng mã |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.15. Cấu trúc cơ sở dữ liệu – Collection MedicalRecord

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID hồ sơ khám |
| patientId | ObjectId (ref: User) | Required, Index | Bệnh nhân |
| doctorId | ObjectId (ref: User) | Required, Index | Bác sĩ |
| appointmentId | ObjectId (ref: Appointment) | Optional, Default null | Lịch hẹn liên quan |
| symptoms | Embedded Document[] | Optional | Danh sách triệu chứng |
| symptoms.name | String | Required (trong phần tử) | Tên triệu chứng |
| symptoms.severity | Number | Default 5, Min 1, Max 10 | Mức độ |
| symptoms.notes | String | Default "" | Ghi chú triệu chứng |
| vitalSigns | Embedded Document | Optional | Dấu hiệu sinh tồn |
| vitalSigns.bloodPressure | String | Default "" | Huyết áp |
| vitalSigns.heartRate | Number | Optional, Default null | Nhịp tim |
| vitalSigns.temperature | Number | Optional, Default null | Nhiệt độ |
| vitalSigns.weight | Number | Optional, Default null | Cân nặng |
| vitalSigns.height | Number | Optional, Default null | Chiều cao |
| vitalSigns.spO2 | Number | Optional, Default null | Nồng độ oxy máu |
| vitalSigns.bloodSugar | Number | Optional, Default null | Đường huyết |
| diagnosis | String | Required | Chẩn đoán chính |
| icdCode | String | Default "" | Mã ICD |
| note | String | Default "" | Ghi chú bác sĩ |
| prescriptionIds | ObjectId[] (ref: Medication) | Optional | Danh sách thuốc kê |
| followUpDate | Date | Optional, Default null | Ngày tái khám |
| status | String | Default COMPLETED, Enum(DRAFT, COMPLETED) | Trạng thái hồ sơ |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.16. Cấu trúc cơ sở dữ liệu – Collection Medication

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID thuốc |
| userId | ObjectId (ref: User) | Required | Bệnh nhân dùng thuốc |
| prescriptionId | ObjectId (ref: Prescription) | Optional, Default null | Đơn thuốc nguồn |
| name | String | Required | Tên thuốc |
| dosage | String | Required | Liều lượng |
| unit | String | Default "mg" | Đơn vị |
| notes | String | Optional, Default null | Ghi chú |
| isActive | Boolean | Default true | Trạng thái sử dụng |
| prescribedBy | ObjectId (ref: User) | Optional, Default null | Bác sĩ kê |
| frequency | String | Required, Enum(DAILY, EVERY_OTHER_DAY) | Tần suất |
| sessions | String[] | Optional, Enum(MORNING, NOON, EVENING) | Các buổi uống |
| mealTiming | String | Default NONE, Enum(BEFORE_MEAL, AFTER_MEAL, NONE) | Thời điểm theo bữa ăn |
| times | String[] | Optional | Danh sách giờ HH:mm |
| startDate | Date | Required | Ngày bắt đầu |
| endDate | Date | Optional, Default null | Ngày kết thúc |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.17. Cấu trúc cơ sở dữ liệu – Collection Message

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID tin nhắn người dùng |
| senderId | ObjectId (ref: User) | Required | Người gửi |
| receiverId | ObjectId (ref: User) | Required | Người nhận |
| content | String | Required, Trim | Nội dung tin nhắn |
| messageType | String | Default text, Enum(text, image, file) | Loại tin nhắn |
| imageUrl | String | Optional, Default null | URL ảnh/file |
| isRead | Boolean | Default false | Đã đọc hay chưa |
| readAt | Date | Optional, Default null | Thời điểm đọc |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.18. Cấu trúc cơ sở dữ liệu – Collection Prescription

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID đơn thuốc |
| userId | ObjectId (ref: User) | Required | Bệnh nhân |
| imageUrl | String | Optional, Default null | Ảnh đơn thuốc |
| doctorName | String | Default "" | Tên bác sĩ |
| patientName | String | Default "" | Tên bệnh nhân |
| diagnosis | String | Default "" | Chẩn đoán |
| startDate | String | Default "" | Ngày bắt đầu |
| notes | String | Default "" | Ghi chú |
| medications | Embedded Document[] | Optional | Danh sách thuốc trong đơn |
| medications.name | String | Required (trong phần tử) | Tên thuốc |
| medications.dosage | String | Default "" | Liều dùng |
| medications.quantity | Number | Default 0 | Số lượng |
| medications.unit | String | Default "Viên" | Đơn vị |
| medications.sessions | String[] | Enum(MORNING, NOON, AFTERNOON, EVENING) | Buổi dùng |
| medications.mealTiming | String | Default AFTER_MEAL, Enum(BEFORE_MEAL, AFTER_MEAL, DURING_MEAL, NONE) | Thời điểm theo bữa |
| medications.instructions | String | Default "" | Hướng dẫn |
| medications.usage | String | Default "" | Công dụng |
| medications.isActive | Boolean | Default true | Trạng thái thuốc |
| medications.confidence | Number | Default 0.5, Min 0, Max 1 | Độ tin cậy AI |
| status | String | Default draft, Enum(draft, confirmed, archived) | Trạng thái đơn |
| rawText | String | Default "" | OCR text thô |
| qualityScore | Number | Default 0, Min 0, Max 1 | Điểm chất lượng OCR |
| verificationNotes | String | Default "" | Ghi chú xác minh |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.19. Cấu trúc cơ sở dữ liệu – Collection Reminder

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID nhắc thuốc |
| medicationId | ObjectId (ref: Medication) | Required, Index | Thuốc liên quan |
| medicationName | String | Required | Tên thuốc |
| dosage | String | Required | Liều |
| unit | String | Required | Đơn vị |
| scheduledTime | Date | Required | Thời gian nhắc |
| status | String | Default PENDING, Enum(PENDING, TAKEN, SKIPPED) | Trạng thái uống |
| mealTiming | String | Default NONE, Enum(BEFORE_MEAL, AFTER_MEAL, NONE) | Thời điểm theo bữa ăn |
| session | String | Default CUSTOM, Enum(MORNING, NOON, EVENING, CUSTOM) | Ca uống |
| takenAt | Date | Optional, Default null | Thời điểm đã uống |
| isSynced | Boolean | Default true | Đồng bộ server/mobile |
| lastUpdated | Date | Default now | Lần cập nhật gần nhất |
| notificationIds | String[] | Default [] | Danh sách notification IDs |
| escalationLevel | Number | Default 0 | Mức escalated nhắc lại |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |

---

## Bảng 1.20. Cấu trúc cơ sở dữ liệu – Collection WellnessLog

| Trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| _id | ObjectId | PK, auto | ID nhật ký wellness |
| userId | ObjectId (ref: User) | Required | Người dùng |
| type | String | Required, Enum(breathing, music) | Loại hoạt động thư giãn |
| durationSeconds | Number | Required | Thời lượng (giây) |
| date | Date | Default now | Ngày ghi log |
| createdAt | Date | Auto (timestamps) | Thời điểm tạo |
| updatedAt | Date | Auto (timestamps) | Thời điểm cập nhật |
