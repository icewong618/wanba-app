-- Amanda 二手车模拟库存：仅清空此商家旧店铺商品并写入 10 辆测试车辆。
-- 目标账号：amanda.guo@ucma.us（原请求邮箱 amanda.guo@gmail.com 未在项目中注册）。

do $$
declare merchant_id uuid;
begin
  select id into merchant_id from auth.users where lower(email)=lower('amanda.guo@ucma.us');
  if merchant_id is null then raise exception 'merchant_account_not_found'; end if;

  delete from public.merchant_auto_leads where merchant_user_id=merchant_id;
  delete from public.merchant_auto_listings where merchant_user_id=merchant_id;
  update public.merchants set products='[]'::jsonb, updated_at=now() where user_id=merchant_id;

  insert into public.merchant_auto_listings
    (merchant_user_id,title,make,model,year,price,mileage,vehicle_type,fuel_type,transmission,drivetrain,exterior_color,vin,condition_note,features,photos,description,status,is_certified)
  values
    (merchant_id,'2022 Toyota RAV4 XLE','Toyota','RAV4',2022,25900,34800,'SUV','汽油','自动挡','AWD','珍珠白','2T3P1RFV7NW100001','模拟库存 · 保养记录完整', '["倒车影像","Apple CarPlay","盲点提示","无钥匙进入"]'::jsonb, '["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"]'::jsonb,'适合家庭日常通勤的紧凑 SUV。此车辆资料用于乐生活二手车功能测试。','available',true),
    (merchant_id,'2021 Honda Civic Sport','Honda','Civic',2021,20800,41200,'轿车','汽油','自动挡','FWD','深灰色','2HGFC2F83MH100002','模拟库存 · 经济省油', '["Apple CarPlay","车道保持","倒车影像","蓝牙"]'::jsonb, '["https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"]'::jsonb,'省油好开，适合通勤和首次购车。此车辆资料用于功能测试。','available',true),
    (merchant_id,'2020 Tesla Model 3 Long Range','Tesla','Model 3',2020,28500,38600,'轿车','纯电','自动挡','AWD','黑色','5YJ3E1EB4LF100003','模拟库存 · 长续航双电机', '["全景玻璃车顶","辅助驾驶","座椅加热","快速充电"]'::jsonb, '["https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80"]'::jsonb,'长续航纯电车型，适合城市和长途使用。此车辆资料用于功能测试。','available',true),
    (merchant_id,'2023 Toyota Camry SE Hybrid','Toyota','Camry',2023,27900,19300,'轿车','混动','自动挡','FWD','银色','4T1G31AK9PU100004','模拟库存 · 低里程混动', '["自适应巡航","Apple CarPlay","盲点提示","双区空调"]'::jsonb, '["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"]'::jsonb,'低里程混动车型，兼顾空间、油耗和舒适性。此车辆资料用于功能测试。','available',true),
    (merchant_id,'2021 Honda CR-V EX','Honda','CR-V',2021,24600,36900,'SUV','汽油','自动挡','FWD','蓝色','7FARW1H57ME100005','模拟库存 · 家庭实用', '["天窗","盲点提示","远程启动","电动尾门"]'::jsonb, '["https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80"]'::jsonb,'空间灵活的家用 SUV。此车辆资料用于功能测试。','available',true),
    (merchant_id,'2022 Ford F-150 XLT','Ford','F-150',2022,34800,42100,'皮卡','汽油','自动挡','RWD','深蓝色','1FTFW1E80NFA00006','模拟库存 · 载货拖挂', '["拖车套件","倒车影像","Apple CarPlay","分区空调"]'::jsonb, '["https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=80"]'::jsonb,'适合工作与家庭兼顾的全尺寸皮卡。此车辆资料用于功能测试。','available',true),
    (merchant_id,'2021 Lexus RX 350','Lexus','RX 350',2021,36900,31500,'SUV','汽油','自动挡','AWD','珍珠白','2T2HZMDA7MC100007','模拟库存 · 豪华舒适', '["真皮座椅","座椅加热","盲点提示","电动尾门"]'::jsonb, '["https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80"]'::jsonb,'舒适安静的豪华 SUV。此车辆资料用于功能测试。','available',true),
    (merchant_id,'2022 BMW X3 xDrive30i','BMW','X3',2022,33500,29600,'SUV','汽油','自动挡','AWD','矿石灰','5UXTY5C09N9A00008','模拟库存 · 四驱操控', '["全景天窗","无线 CarPlay","倒车影像","驾驶辅助"]'::jsonb, '["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"]'::jsonb,'兼顾操控和实用性的豪华 SUV。此车辆资料用于功能测试。','available',true),
    (merchant_id,'2020 Toyota Sienna XLE','Toyota','Sienna',2020,31800,45000,'VAN','混动','自动挡','FWD','白色','5TDYZ3DC2LS100009','模拟库存 · 七座家庭车', '["七座","电动侧滑门","倒车影像","后排空调"]'::jsonb, '["https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"]'::jsonb,'适合多人家庭与接送需求。此车辆资料用于功能测试。','available',true),
    (merchant_id,'2021 Jeep Wrangler Sahara','Jeep','Wrangler',2021,32900,37800,'SUV','汽油','自动挡','4WD','沙色','1C4HJXEG5MW100010','模拟库存 · 四驱越野', '["四驱系统","可拆卸车顶","倒车影像","越野轮胎"]'::jsonb, '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"]'::jsonb,'适合周末户外与越野爱好者。此车辆资料用于功能测试。','available',true);
end $$;
