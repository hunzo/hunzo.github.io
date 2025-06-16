---
layout: single
title: "ขั้นตอนการตั้งค่า Certificate Template สำหรับ 802.1X บน Windows Server"
date: 2025-06-05 10:30:00 +0700
categories: [blog]
tags: [802.1x, radius, window, AD]
author: takraw
---

# Certificate Template for 802.1X on Windows Server

เอกสารนี้สรุปขั้นตอนทั้งหมดสำหรับการสร้าง, ตั้งค่า, และแจกจ่าย Certificate สำหรับการยืนยันตัวตนผ่านเครือข่ายด้วยมาตรฐาน 802.1X โดยใช้ Active Directory Certificate Services (AD CS) บน Windows Server

---

## 📋 1. สิ่งที่ต้องมีก่อน (Prerequisites)

ก่อนเริ่มต้น ต้องแน่ใจว่าระบบของคุณมีองค์ประกอบต่อไปนี้ครบถ้วน:

1.  **Active Directory Domain Services (AD DS):** ติดตั้งและทำงานได้อย่างสมบูรณ์
2.  **Active Directory Certificate Services (AD CS):** ติดตั้ง Role นี้และตั้งค่าเป็น **Enterprise CA** (Certificate Authority) เรียบร้อยแล้ว
3.  **Network Policy Server (NPS):** ติดตั้ง Role นี้บนเซิร์ฟเวอร์ (อาจจะเป็นเครื่องเดียวกับ CA หรือคนละเครื่องก็ได้)

---

## 📝 2. การสร้าง Certificate Templates

เราจะสร้าง Template ที่จำเป็น 2 ประเภท คือสำหรับ RADIUS Server และสำหรับ Client

### 🖥️ 2.1 สร้าง Template สำหรับ RADIUS (NPS) Server

Template นี้ใช้สำหรับให้ NPS Server ยืนยันตัวตนกับเครื่องลูกข่าย

1.  บนเซิร์ฟเวอร์ที่ติดตั้ง AD CS, เปิด **Certificate Authority** (จาก Server Manager > Tools)
2.  คลิกขวาที่โฟลเดอร์ `Certificate Templates` และเลือก **Manage**
3.  ในหน้าต่าง `Certificate Templates Console`, ค้นหา Template ชื่อ **RAS and IAS Server**
4.  คลิกขวาที่ **RAS and IAS Server** และเลือก **Duplicate Template**
5.  ตั้งค่าในแท็บต่างๆ ดังนี้:
    - **แท็บ General:**
      - **Template display name:** `802.1X RADIUS Server` (หรือชื่ออื่นที่เข้าใจง่าย)
      - **Validity period:** `2 years` (แนะนำ)
    - **แท็บ Request Handling:**
      - (แนะนำ) ติ๊กถูกที่ `Allow private key to be exported` เพื่อความสะดวกในการสำรองข้อมูลหรือย้ายเซิร์ฟเวอร์
    - **แท็บ Subject Name:**
      - เลือก **Build from this Active Directory information**
      - **Subject name format:** เลือก **DNS name**
    - **แท็บ Security:**
      - คลิก **Add...** และเพิ่มกลุ่ม `RAS and IAS Servers` (หรือเพิ่ม Computer Account ของ NPS Server โดยตรง)
      - เลือกกลุ่มที่เพิ่มเข้ามา แล้วให้สิทธิ์ (Allow) `Read` และ `Enroll`
    - **แท็บ Extensions:**
      - ตรวจสอบว่าใน **Application Policies** มี `Server Authentication` อยู่
6.  คลิก **Apply** และ **OK**

### 👥 2.2 สร้าง Template สำหรับ Client (Computer Authentication)

Template นี้ใช้สำหรับแจกจ่ายให้เครื่องลูกข่ายใน Domain โดยอัตโนมัติ (ปลอดภัยที่สุด)

1.  ในหน้าต่าง `Certificate Templates Console` เดิม, ค้นหา Template ชื่อ **Workstation Authentication**
2.  คลิกขวาที่ **Workstation Authentication** และเลือก **Duplicate Template**
3.  ตั้งค่าในแท็บต่างๆ ดังนี้:
    - **แท็บ General:**
      - **Template display name:** `802.1X Client Authentication`
    - **แท็บ Request Handling:**
      - > **สำคัญ:** **ไม่ต้องติ๊ก** `Allow private key to be exported` เพื่อความปลอดภัยสูงสุด ป้องกันการคัดลอก Certificate ไปยังเครื่องที่ไม่ได้รับอนุญาต
    - **แท็บ Subject Name:**
      - เลือก **Build from this Active Directory information**
      - **Subject name format:** เลือก **DNS name**
    - **แท็บ Security:**
      - คลิก **Add...** และเพิ่มกลุ่ม `Domain Computers`
      - เลือกกลุ่ม `Domain Computers` และให้สิทธิ์ (Allow) `Read`, `Enroll`, และ **`Autoenroll`**
        > **สำคัญ:** การให้สิทธิ์ `Autoenroll` เป็นหัวใจสำคัญที่ทำให้เครื่องลูกข่ายได้รับ Certificate โดยอัตโนมัติผ่าน Group Policy
    - **แท็บ Extensions:**
      - ตรวจสอบว่าใน **Application Policies** มี `Client Authentication` อยู่
4.  คลิก **Apply** และ **OK**

---

## 📜 3. การเปิดใช้งาน Template ที่สร้างขึ้น (Issue Templates)

หลังจากสร้าง Template แล้ว ต้องสั่งให้ CA เริ่มออก Certificate ตาม Template เหล่านี้

1.  กลับไปที่หน้าต่างหลักของ **Certificate Authority**
2.  คลิกขวาที่โฟลเดอร์ `Certificate Templates` -> **New** -> **Certificate Template to Issue**
3.  ในหน้าต่างที่ปรากฏขึ้น, เลือก Template ทั้ง 2 อันที่เราเพิ่งสร้าง:
    - `802.1X RADIUS Server`
    - `802.1X Client Authentication`
4.  คลิก **OK**

---

## 🚀 4. การนำไปใช้งานและแจกจ่าย (Deployment)

### ⚙️ 4.1 การติดตั้ง Certificate บน NPS Server

1.  บน NPS Server, เปิด **MMC** โดยกด `Win + R` พิมพ์ `mmc` แล้ว Enter
2.  ไปที่ **File** > **Add/Remove Snap-in...**
3.  เลือก **Certificates** -> **Add** -> เลือก **Computer account** -> **Next** -> **Finish** -> **OK**
4.  ในหน้าต่าง MMC, ขยาย **Certificates (Local Computer)** -> **Personal**
5.  คลิกขวาที่โฟลเดอร์ **Certificates** -> **All Tasks** -> **Request New Certificate...**
6.  คลิก **Next** สองครั้ง (เลือก Active Directory Enrollment Policy)
7.  ติ๊กเลือก Template **`802.1X RADIUS Server`** ที่เราสร้างไว้
8.  คลิก **Enroll**

### 💻 4.2 การตั้งค่าให้ Client ได้รับ Certificate อัตโนมัติ (Group Policy)

1.  เปิด **Group Policy Management**
2.  สร้าง GPO ใหม่ (หรือแก้ไข GPO ที่มีอยู่) ที่ลิงก์ไปยัง OU ที่มี Computer Accounts ของเครื่องลูกข่าย
3.  แก้ไข GPO นั้น และไปที่ Path:
    `Computer Configuration -> Policies -> Windows Settings -> Security Settings -> Public Key Policies`
4.  ในหน้าต่างด้านขวา, ดับเบิลคลิกที่ **Certificate Services Client - Auto-Enrollment**
5.  ตั้งค่าดังนี้:
    - **Configuration Model:** `Enabled`
    - ติ๊กถูกที่ `Renew expired certificates, update pending certificates, and remove revoked certificates`
    - ติ๊กถูกที่ `Update certificates that use certificate templates`
6.  คลิก **Apply** และ **OK**

หลังจากนั้น เมื่อเครื่อง Client ทำการ `gpupdate /force` หรือมีการ Restart ก็จะได้รับ Certificate `802.1X Client Authentication` โดยอัตโนมัติ

### 🔧 4.3 กรณีพิเศษ: การ Export Certificate เพื่อติดตั้งด้วยตนเอง

ใช้สำหรับอุปกรณ์นอกโดเมน (Non-Domain Joined) หรืออุปกรณ์พิเศษ (BYOD, IoT)

> **Best Practice:** ควรสร้าง Template ใหม่สำหรับกรณีนี้โดยเฉพาะ อย่าแก้ไข Template หลักที่ใช้กับเครื่องในโดเมน

1.  **สร้าง Template ใหม่:** ทำซ้ำขั้นตอนที่ **2.2** แต่ตั้งชื่อว่า `802.1X Manual Install`
2.  **ตั้งค่าให้ Export ได้:** ในแท็บ **Request Handling** ของ Template ใหม่นี้ ให้ติ๊กถูกที่ **`Allow private key to be exported`**
3.  **ออก Certificate:** ทำการ Issue Template ใหม่นี้ตามขั้นตอนที่ **3**
4.  **ร้องขอและ Export:**
    - จากเครื่องในโดเมน, ใช้ `certlm.msc` ร้องขอ Certificate จาก Template `802.1X Manual Install`
    - หลังจากได้รับแล้ว ให้คลิกขวาที่ Certificate -> **All Tasks** -> **Export...**
    - ใน Wizard ให้เลือก **Yes, export the private key**
    - เลือก Format เป็น **.PFX**, ตั้งรหัสผ่านที่คาดเดายาก
5.  **นำไปติดตั้ง:** นำไฟล์ `.pfx` ที่ได้ไปติดตั้งบนอุปกรณ์เป้าหมาย โดยจะต้องใส่รหัสผ่านที่ตั้งไว้

---
