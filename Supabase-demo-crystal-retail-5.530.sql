-- 乐生活 v5.530：零售商测试账号
-- crystal.shi@ucma.us / 洛杉矶家庭折扣仓

begin;

update public.merchants
set
  business_name = '洛杉矶家庭折扣仓',
  category = '零售好物',
  subcategory = '综合折扣仓',
  address = '9565 E Las Tunas Dr, Temple City, CA 91780',
  market_code = 'la',
  slug = 'la-family-discount-warehouse',
  intro = '洛杉矶家庭折扣仓为周边家庭精选高性价比的小电器、厨房用品、居家收纳与日用好物。每日更新限时折扣，欢迎到店慢慢挑。',
  microsite_title = '洛杉矶家庭折扣仓',
  seo_description = '洛杉矶家庭折扣仓：小电器、厨房用品、居家收纳与家庭日用好物折扣。地址：9565 E Las Tunas Dr, Temple City, CA 91780。',
  business_hours = '每日 10:00 AM - 8:00 PM',
  logo = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=420&q=82',
  cover_image = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=82',
  perks = jsonb_build_array('会员专属周末折扣', '满额可享到店自提优惠', '新品与限时清仓优先通知'),
  loyalty_target = 10,
  loyalty_reward = '集满 10 次消费可领取 $10 店内优惠券',
  coupons = jsonb_build_array(
    jsonb_build_object('id','retail-welcome-10','badge','新客','title','新客满 $50 减 $5','title_en','New Customer $5 Off $50','description','首次到店消费满 $50 可使用','description_en','Save $5 on your first $50 purchase','active',true),
    jsonb_build_object('id','retail-weekend-15','badge','周末','title','周末家居用品 85 折','title_en','15% Off Home Essentials','description','每周六、日指定居家用品可享 85 折','description_en','15% off selected home essentials on weekends','active',true)
  ),
  products = jsonb_build_array(
    jsonb_build_object('id','retail-01','name','4.5Qt 空气炸锅','name_en','4.5Qt Air Fryer','category','小电器','description','无油热风烹饪，适合 2 至 4 人家庭。','description_en','Oil-free hot air cooking for 2 to 4 people.','price','$39.99','active',true,'image','https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-02','name','便携搅拌机','name_en','Portable Blender','category','小电器','description','随行杯设计，果昔和蛋白饮快速制作。','description_en','Blend smoothies and protein drinks in minutes.','price','$18.99','active',true,'image','https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-03','name','多功能电饭煲','name_en','Multi-Cooker Rice Cooker','category','小电器','description','煮饭、煲汤、蒸煮一机完成。','description_en','Rice, soup, steam, and more in one appliance.','price','$32.99','active',true,'image','https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-04','name','不锈钢电热水壶','name_en','Stainless Steel Electric Kettle','category','小电器','description','快速烧水，自动断电保护。','description_en','Fast boiling with automatic shutoff.','price','$16.99','active',true,'image','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-05','name','桌面循环风扇','name_en','Desktop Circulation Fan','category','小电器','description','三档风速，小巧静音。','description_en','Three speeds in a compact, quiet design.','price','$14.99','active',true,'image','https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-06','name','超声波加湿器','name_en','Ultrasonic Humidifier','category','小电器','description','卧室与办公桌适用，带柔和夜灯。','description_en','For bedrooms and desks, with a soft night light.','price','$22.99','active',true,'image','https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-07','name','手持蒸汽挂烫机','name_en','Handheld Garment Steamer','category','小电器','description','出门前快速整理衬衫与连衣裙。','description_en','Quickly refresh shirts and dresses before you go.','price','$24.99','active',true,'image','https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-08','name','胶囊咖啡机','name_en','Single Serve Coffee Maker','category','小电器','description','一键冲泡，适合办公室和小户型。','description_en','One-touch brewing for offices and small spaces.','price','$29.99','active',true,'image','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-09','name','不粘锅三件套','name_en','3-Piece Nonstick Pan Set','category','厨房用品','description','常用煎锅尺寸组合，适合日常料理。','description_en','Everyday skillet sizes for home cooking.','price','$26.99','active',true,'image','https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-10','name','不锈钢厨刀套装','name_en','Stainless Steel Knife Set','category','厨房用品','description','含主厨刀、削皮刀与刀座。','description_en','Includes chef knife, paring knife, and block.','price','$34.99','active',true,'image','https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-11','name','玻璃保鲜盒 10 件套','name_en','10-Piece Glass Storage Set','category','厨房用品','description','耐热玻璃，适合备餐和冰箱收纳。','description_en','Heat-safe glass for meal prep and fridge storage.','price','$21.99','active',true,'image','https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-12','name','竹制切菜板两件套','name_en','2-Piece Bamboo Cutting Board','category','厨房用品','description','双尺寸组合，轻巧耐用。','description_en','Two useful sizes, lightweight and durable.','price','$12.99','active',true,'image','https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-13','name','硅胶烘焙工具套装','name_en','Silicone Baking Tool Set','category','厨房用品','description','耐高温刮刀、刷子与量勺组合。','description_en','Heat-safe spatulas, brushes, and measuring spoons.','price','$11.99','active',true,'image','https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-14','name','双层碗盘沥水架','name_en','Two-Tier Dish Drying Rack','category','厨房用品','description','节省台面空间，带可拆卸接水盘。','description_en','Saves counter space with a removable drip tray.','price','$19.99','active',true,'image','https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-15','name','水槽收纳整理架','name_en','Sink Organizer Caddy','category','厨房用品','description','海绵、清洁刷和洗洁精一处收纳。','description_en','Keeps sponges, brushes, and soap together.','price','$8.99','active',true,'image','https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-16','name','带盖收纳箱 3 件套','name_en','3-Piece Lidded Storage Bin Set','category','居家收纳','description','透明可叠放，适合衣柜和储物间。','description_en','Clear stackable bins for closets and storage rooms.','price','$17.99','active',true,'image','https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-17','name','折叠洗衣篮','name_en','Foldable Laundry Basket','category','居家收纳','description','轻便可折叠，适合公寓和宿舍。','description_en','Lightweight and foldable for apartments and dorms.','price','$9.99','active',true,'image','https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-18','name','床下收纳袋两件套','name_en','2-Piece Underbed Storage Bags','category','居家收纳','description','换季衣物和被子整洁收纳。','description_en','Store seasonal clothes and bedding neatly.','price','$13.99','active',true,'image','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-19','name','可调节金属置物架','name_en','Adjustable Metal Storage Shelf','category','居家收纳','description','厨房、车库与储物间通用。','description_en','Useful in kitchens, garages, and storage rooms.','price','$42.99','active',true,'image','https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-20','name','抽屉分隔收纳盒 12 件','name_en','12-Piece Drawer Organizer Set','category','居家收纳','description','化妆品、文具和袜子分类更清楚。','description_en','Organize cosmetics, stationery, and socks.','price','$10.99','active',true,'image','https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-21','name','超细纤维毛巾 12 条','name_en','12-Pack Microfiber Towels','category','清洁日用','description','厨房、车辆和居家清洁都适用。','description_en','For kitchen, auto, and household cleaning.','price','$11.99','active',true,'image','https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-22','name','旋转拖把套装','name_en','Spin Mop Set','category','清洁日用','description','省力旋转脱水，附替换拖布。','description_en','Easy wringing with a replacement mop head.','price','$24.99','active',true,'image','https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-23','name','可降解垃圾袋 120 只','name_en','120-Pack Compostable Trash Bags','category','清洁日用','description','日常厨房与小型垃圾桶适用。','description_en','For everyday kitchen and small-bin use.','price','$14.99','active',true,'image','https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-24','name','多用途清洁喷雾','name_en','Multi-Surface Cleaning Spray','category','清洁日用','description','台面、浴室和玻璃表面均可使用。','description_en','For counters, bathrooms, and glass surfaces.','price','$5.99','active',true,'image','https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-25','name','记忆棉枕头两只装','name_en','2-Pack Memory Foam Pillows','category','居家用品','description','中等支撑，适合侧睡和仰睡。','description_en','Medium support for side and back sleepers.','price','$27.99','active',true,'image','https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-26','name','四件套床品','name_en','4-Piece Bedding Set','category','居家用品','description','柔软透气，含被套与枕套。','description_en','Soft and breathable, including duvet and pillow covers.','price','$29.99','active',true,'image','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-27','name','简约落地灯','name_en','Minimal Floor Lamp','category','居家用品','description','暖光阅读灯，客厅和卧室都适合。','description_en','Warm reading light for living rooms and bedrooms.','price','$31.99','active',true,'image','https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-28','name','USB 充电台灯','name_en','USB Charging Desk Lamp','category','居家用品','description','三档亮度，底座带 USB 充电口。','description_en','Three brightness levels with a USB charging port.','price','$18.99','active',true,'image','https://images.unsplash.com/photo-1534278931827-8a259344abe7?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-29','name','带盖宠物粮食桶','name_en','Pet Food Storage Container','category','居家用品','description','密封防潮，附取粮勺。','description_en','Airtight moisture protection with scoop included.','price','$15.99','active',true,'image','https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=82'),
    jsonb_build_object('id','retail-30','name','门口防滑地垫','name_en','Non-Slip Entry Mat','category','居家用品','description','耐脏易清洁，适合玄关和后门。','description_en','Durable and easy to clean for entryways and back doors.','price','$12.99','active',true,'image','https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=82')
  ),
  enabled_features = '[]'::jsonb,
  verification_status = 'approved',
  verified = true,
  updated_at = now()
where user_id = '1afa47f5-aa14-4e42-9718-285c28fcd7d9';

update public.profiles
set
  name = '洛杉矶家庭折扣仓',
  bio = '小电器、厨房用品、居家收纳与家庭日用好物折扣仓。每日更新限时优惠，欢迎到店选购。',
  tags = array['零售好物','家庭折扣','洛杉矶'],
  market_code = 'la',
  updated_at = now()
where user_id = '1afa47f5-aa14-4e42-9718-285c28fcd7d9';

delete from public.merchant_member_transactions
where merchant_user_id = '1afa47f5-aa14-4e42-9718-285c28fcd7d9';

delete from public.merchant_memberships
where merchant_user_id = '1afa47f5-aa14-4e42-9718-285c28fcd7d9';

commit;
