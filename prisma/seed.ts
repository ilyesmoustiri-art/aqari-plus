import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import bcrypt from "bcryptjs";

async function main() {
  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.contactRequest.deleteMany();
  await prisma.taxPayment.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "مدير المنصة",
      email: "admin@aqari.dz",
      phone: "+213 555 000 001",
      password: adminPassword,
      role: "مدير",
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "أحمد بن علي",
      email: "user@aqari.dz",
      phone: "+213 555 000 002",
      password: userPassword,
      role: "مستخدم",
    },
  });

  const ownerUser = await prisma.user.create({
    data: {
      name: "محمد العقاري",
      email: "owner@aqari.dz",
      phone: "+213 555 000 003",
      password: userPassword,
      role: "مالك عقارات",
    },
  });

  const agentUser = await prisma.user.create({
    data: {
      name: "سارة وكيلة",
      email: "agent@aqari.dz",
      phone: "+213 555 000 004",
      password: userPassword,
      role: "وكيل عقاري",
    },
  });

  console.log("Created 4 users (admin, user, owner, agent)");

  // Create properties linked to users
  const p1 = await prisma.property.create({
    data: {
      title: "شقة فاخرة في وسط المدينة",
      description: "شقة فاخرة مؤثثة بالكامل في قلب المدينة، تطل على حديقة خضراء. تحتوي على 3 غرف نوم واسعة ومطبخ مجهز بأحدث المعدات، بالإضافة إلى شرفة واسعة بإطلالة بانورامية. المنطقة هادئة وآمنة وقريبة من جميع المرافق الأساسية.",
      type: "شقة",
      price: 85000000,
      area: 150,
      rooms: 4,
      bathrooms: 2,
      city: "الجزائر العاصمة",
      address: "شارع ديدوش مراد، حيدرة",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      featured: true,
      status: "متاح",
      userId: ownerUser.id,
    },
  });

  const p2 = await prisma.property.create({
    data: {
      title: "فيلا مستقلة بحديقة خاصة",
      description: "فيلا فاخرة من الطراز الحديث تتوسط حديقة خضراء واسعة. تضم 5 غرف نوم مع حمام خاص لكل غرفة، صالة استقبال كبيرة، مطبخ مفتوح، ومسبح خاص. التصميم عصري مع نوافذ زجاجية واسعة تسمح بدخول الضوء الطبيعي.",
      type: "فيلا",
      price: 250000000,
      area: 400,
      rooms: 6,
      bathrooms: 4,
      city: "وهران",
      address: "حي السعادة، طريق الميناء",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      featured: true,
      status: "متاح",
      userId: ownerUser.id,
    },
  });

  const p3 = await prisma.property.create({
    data: {
      title: "مكتب تجاري في منطقة الأعمال",
      description: "مكتب تجاري واسع في برج عصري بمنطقة الأعمال المركزية. مصمم بيئة عمل مريحة ومرنة مع إطلالة رائعة على المدينة. يحتوي على غرفة اجتماعات ومطبخ صغير ومرافق متكاملة.",
      type: "مكتب",
      price: 120000000,
      area: 200,
      rooms: 6,
      bathrooms: 3,
      city: "قسنطينة",
      address: "شارع 20 أوت، وسط المدينة",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      featured: true,
      status: "متاح",
      userId: agentUser.id,
    },
  });

  const p4 = await prisma.property.create({
    data: {
      title: "شقة حديثة بملحق تجاري",
      description: "شقة عصرية بتصميم أنيق تضم ملحقاً تجارياً يمكن استخدامه كمكتب أو متجر صغير. تقع في حي سكني راقٍ بالقرب من المدارس والجامعات والمستشفيات. مثالية للعائلات الصغيرة.",
      type: "شقة",
      price: 55000000,
      area: 120,
      rooms: 3,
      bathrooms: 2,
      city: "سطيف",
      address: "حي 1000 مسكن، شارع 8 ماي",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      featured: false,
      status: "متاح",
      userId: agentUser.id,
    },
  });

  const p5 = await prisma.property.create({
    data: {
      title: "أرض سكنية قابلة للبناء",
      description: "أرض سكنية واسعة في منطقة حيوية قريبة من الطريق الوطني. صالحة للبناء مع جميع التسهيلات الضرورية (ماء، كهرباء، غاز طبيعي). مثالية لمشاريع سكنية أو تجارية.",
      type: "أرض",
      price: 35000000,
      area: 500,
      city: "البليدة",
      address: "الطريق الوطني رقم 5",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
      featured: false,
      status: "متاح",
      userId: ownerUser.id,
    },
  });

  const p6 = await prisma.property.create({
    data: {
      title: "منزل تقليدي مجدد بالكامل",
      description: "منزل تقليدي تم تجديده بالكامل مع الحفاظ على الطراز المعماري الأصيل. يتكون من طابقين مع فناء داخلي وبئر ماء. مثالي لعشاق الطراز الكلاسيكي مع وسائل الراحة الحديثة.",
      type: "منزل",
      price: 65000000,
      area: 250,
      rooms: 5,
      bathrooms: 3,
      city: "تلمسان",
      address: "الحي العتيق، شارع العربي بن مهيدي",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      featured: true,
      status: "متاح",
      userId: ownerUser.id,
    },
  });

  const p7 = await prisma.property.create({
    data: {
      title: "شقة استوديو مؤثثة للإيجار",
      description: "شقة استوديو عصرية مؤثثة بالكامل وجاهزة للسكن. مثالية للطلاب أو الأفراد العاملين. تقع في منطقة راقية قريبة من وسائل النقل العام والمحلات التجارية.",
      type: "شقة",
      price: 25000000,
      area: 55,
      rooms: 1,
      bathrooms: 1,
      city: "عنابة",
      address: "حي الحسنية، شارع الأمير عبد القادر",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      featured: false,
      status: "مباع",
      userId: agentUser.id,
    },
  });

  const p8 = await prisma.property.create({
    data: {
      title: "محل تجاري في شارع رئيسي",
      description: "محل تجاري في موقع استراتيجي على شارع رئيسي ذو حركة مرور عالية. مناسب لمختلف الأنشطة التجارية. يحتوي على واجهة زجاجية واسعة ومخزن في الخلف.",
      type: "محل تجاري",
      price: 45000000,
      area: 80,
      city: "باتنة",
      address: "شارع الثورة، وسط المدينة",
      image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb4?w=800&h=600&fit=crop",
      featured: false,
      status: "متاح",
      userId: agentUser.id,
    },
  });

  const p9 = await prisma.property.create({
    data: {
      title: "شقة بنتهاوس مع تراس فاخر",
      description: "شقة بنتهاوس فاخرة في الطابق الأخير مع تراس واسع وإطلالة بانورامية على البحر. تصميم عصري فاخر مع أجهزة ذكية وإنهاءات عالية الجودة. تشمل مرآب خاص وغرفة خدمة.",
      type: "شقة",
      price: 180000000,
      area: 220,
      rooms: 4,
      bathrooms: 3,
      city: "بيجاي",
      address: "شارع لارسي بن مهيدي، الكورنيش",
      image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      featured: true,
      status: "متاح",
      userId: ownerUser.id,
    },
  });

  const p10 = await prisma.property.create({
    data: {
      title: "مبنى سكني كامل",
      description: "مبنى سكني كامل مكون من 4 طوابق يحتوي على 8 شقق سكنية. فرصة استثمارية ممتازة. المبنى في حالة جيدة ويحتاج فقط بعض التجديدات الخفيفة.",
      type: "مبنى",
      price: 320000000,
      area: 800,
      rooms: 24,
      bathrooms: 16,
      city: "الجزائر العاصمة",
      address: "حسين داي، شارع الحبيب بورقيبة",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      featured: true,
      status: "متاح",
      userId: ownerUser.id,
    },
  });

  const p11 = await prisma.property.create({
    data: {
      title: "شقة اقتصادية للشباب",
      description: "شقة اقتصادية بتصميم عملي وعصري. مناسبة للأزواج الشباب أو كاستثمار أولي. تقع في حي سكني هادئ مع جميع الخدمات الأساسية في متناول اليد.",
      type: "شقة",
      price: 18000000,
      area: 70,
      rooms: 2,
      bathrooms: 1,
      city: "المسيلة",
      address: "حي النصر، شارع 1 نوفمبر",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      featured: false,
      status: "متاح",
      userId: agentUser.id,
    },
  });

  const p12 = await prisma.property.create({
    data: {
      title: "عمارة تجارية سكنية مختلطة",
      description: "عمارة مختلطة تحتوي على 3 طوابق سكنية وطابقين تجاريين. فرصة استثمارية مميزة في منطقة نامية. تصميم حديث وموقع متميز بالقرب من المحطة الجديدة.",
      type: "مبنى",
      price: 450000000,
      area: 1200,
      rooms: 12,
      bathrooms: 10,
      city: "الجزائر العاصمة",
      address: "باب الزوار، شارع الجديدة",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      featured: false,
      status: "متاح",
      userId: admin.id,
    },
  });

  console.log("Created 12 properties linked to users");

  // Create tax payments linked to users
  await prisma.taxPayment.createMany({
    data: [
      {
        propertyId: p1.id,
        userId: ownerUser.id,
        type: "ضريبة العقار",
        amount: 850000,
        status: "مدفوع",
        dueDate: new Date("2025-03-31"),
        paidDate: new Date("2025-03-15"),
        reference: "TAX-2025-001",
        description: "ضريبة العقار السنوية - الربع الأول 2025",
      },
      {
        propertyId: p1.id,
        userId: ownerUser.id,
        type: "ضريبة العقار",
        amount: 850000,
        status: "قيد الانتظار",
        dueDate: new Date("2025-06-30"),
        reference: "TAX-2025-002",
        description: "ضريبة العقار السنوية - الربع الثاني 2025",
      },
      {
        propertyId: p2.id,
        userId: ownerUser.id,
        type: "ضريبة العقار",
        amount: 2500000,
        status: "مدفوع",
        dueDate: new Date("2025-03-31"),
        paidDate: new Date("2025-03-20"),
        reference: "TAX-2025-003",
        description: "ضريبة العقار السنوية - الربع الأول 2025",
      },
      {
        propertyId: p2.id,
        userId: ownerUser.id,
        type: "ضريبة الخدمات البلدية",
        amount: 150000,
        status: "متأخر",
        dueDate: new Date("2025-01-31"),
        reference: "TAX-2025-004",
        description: "رسوم الخدمات البلدية للربع الأول 2025",
      },
      {
        propertyId: p3.id,
        userId: agentUser.id,
        type: "ضريبة العقار",
        amount: 1200000,
        status: "مدفوع",
        dueDate: new Date("2025-03-31"),
        paidDate: new Date("2025-03-25"),
        reference: "TAX-2025-005",
        description: "ضريبة العقار السنوية - الربع الأول 2025",
      },
      {
        propertyId: p3.id,
        userId: agentUser.id,
        type: "ضريبة المهنية",
        amount: 600000,
        status: "قيد الانتظار",
        dueDate: new Date("2025-05-31"),
        reference: "TAX-2025-006",
        description: "ضريبة النشاط المهني - 2025",
      },
      {
        propertyId: p4.id,
        userId: agentUser.id,
        type: "ضريبة العقار",
        amount: 550000,
        status: "مدفوع",
        dueDate: new Date("2025-03-31"),
        paidDate: new Date("2025-03-10"),
        reference: "TAX-2025-007",
        description: "ضريبة العقار السنوية - الربع الأول 2025",
      },
      {
        propertyId: p5.id,
        userId: ownerUser.id,
        type: "ضريبة الأراضي",
        amount: 350000,
        status: "قيد الانتظار",
        dueDate: new Date("2025-06-30"),
        reference: "TAX-2025-008",
        description: "ضريبة الأراضي غير المبنية - 2025",
      },
      {
        propertyId: p6.id,
        userId: ownerUser.id,
        type: "ضريبة العقار",
        amount: 650000,
        status: "مدفوع",
        dueDate: new Date("2025-03-31"),
        paidDate: new Date("2025-03-22"),
        reference: "TAX-2025-009",
        description: "ضريبة العقار السنوية - الربع الأول 2025",
      },
      {
        propertyId: p6.id,
        userId: ownerUser.id,
        type: "ضريبة التسجيل",
        amount: 1300000,
        status: "متأخر",
        dueDate: new Date("2025-02-28"),
        reference: "TAX-2025-010",
        description: "رسوم تسجيل نقل الملكية",
      },
      {
        propertyId: p9.id,
        userId: ownerUser.id,
        type: "ضريبة العقار",
        amount: 1800000,
        status: "قيد الانتظار",
        dueDate: new Date("2025-06-30"),
        reference: "TAX-2025-011",
        description: "ضريبة العقار السنوية - الربع الثاني 2025",
      },
      {
        propertyId: p10.id,
        userId: ownerUser.id,
        type: "ضريبة العقار",
        amount: 3200000,
        status: "مدفوع",
        dueDate: new Date("2025-03-31"),
        paidDate: new Date("2025-03-18"),
        reference: "TAX-2025-012",
        description: "ضريبة العقار السنوية - الربع الأول 2025",
      },
    ],
  });

  // Create some contact requests linked to users
  await prisma.contactRequest.createMany({
    data: [
      {
        name: "أحمد بن علي",
        phone: "+213 555 000 002",
        email: "user@aqari.dz",
        propertyId: p1.id,
        userId: regularUser.id,
        message: "مرحباً، أريد الاستفسار عن هذه الشقة الفاخرة. هل لا تزال متاحة؟ وما هي إمكانية التقسيط؟",
        read: false,
      },
      {
        name: "فاطمة الزهراء",
        phone: "+213 666 111 222",
        email: "fatima@email.com",
        propertyId: p2.id,
        message: "أرغب في زيارة الفيلا. هل يمكن تحديد موعد للمعاينة؟",
        read: true,
      },
      {
        name: "كريم بوجلال",
        phone: "+213 777 333 444",
        email: "karim@email.com",
        propertyId: p9.id,
        message: "ما هو السعر النهائي للبنتهاوس؟ هل يمكن الحصول على خصم؟",
        read: false,
      },
    ],
  });

  console.log("Created 12 tax payments and 3 contact requests linked to users");
  // Create sample messages between users
  await prisma.message.createMany({
    data: [
      {
        senderId: regularUser.id,
        receiverId: ownerUser.id,
        content: "مرحباً محمد، أريد الاستفسار عن الشقة الفاخرة في وسط المدينة. هل لا تزال متاحة؟",
        propertyId: p1.id,
      },
      {
        senderId: ownerUser.id,
        receiverId: regularUser.id,
        content: "أهلاً أحمد، نعم الشقة لا تزال متاحة. السعر 85 مليون دج. هل تريد تحديد موعد للمعاينة؟",
        propertyId: p1.id,
      },
      {
        senderId: regularUser.id,
        receiverId: ownerUser.id,
        content: "نعم أريد المعاينة. متى يناسبك؟",
        propertyId: p1.id,
      },
      {
        senderId: agentUser.id,
        receiverId: ownerUser.id,
        content: "محمد، هناك عميل مهتم بالفيلا في وهران. هل يمكننا تحديد سعر خاص؟",
        propertyId: p2.id,
      },
      {
        senderId: ownerUser.id,
        receiverId: agentUser.id,
        content: "يمكن تقديم خصم 5% للعميل الجاد. الفيا تقدر بـ 237 مليون بعد الخصم.",
        propertyId: p2.id,
      },
    ],
  });

  console.log("Created sample messages between users");
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
