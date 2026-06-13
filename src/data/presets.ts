import type { PresetData } from '../types';

const foodData: PresetData = {
  title: '吃什么',
  titleColor: [1.0, 0.7, 0.3],
  data: [
    { id: '1', name: '火锅', emoji: '🍲', imgUrl: '', desc: '热辣滚烫', title: '', subtitle: '' },
    { id: '2', name: '烧烤', emoji: '🍖', imgUrl: '', desc: '炭火飘香', title: '', subtitle: '' },
    { id: '3', name: '麻辣烫', emoji: '🥘', imgUrl: '', desc: '麻辣鲜香', title: '', subtitle: '' },
    { id: '4', name: '炒饭', emoji: '🍛', imgUrl: '', desc: '粒粒分明', title: '', subtitle: '' },
    { id: '5', name: '拉面', emoji: '🍜', imgUrl: '', desc: '汤浓面劲', title: '', subtitle: '' },
    { id: '6', name: '饺子', emoji: '🥟', imgUrl: '', desc: '皮薄馅大', title: '', subtitle: '' },
    { id: '7', name: '汉堡', emoji: '🍔', imgUrl: '', desc: '经典美式', title: '', subtitle: '' },
    { id: '8', name: '披萨', emoji: '🍕', imgUrl: '', desc: '芝士拉丝', title: '', subtitle: '' },
    { id: '9', name: '寿司', emoji: '🍣', imgUrl: '', desc: '新鲜日料', title: '', subtitle: '' },
    { id: '10', name: '炸鸡', emoji: '🍗', imgUrl: '', desc: '酥脆多汁', title: '', subtitle: '' },
    { id: '11', name: '冒菜', emoji: '🌶️', imgUrl: '', desc: '一人火锅', title: '', subtitle: '' },
    { id: '12', name: '烤鱼', emoji: '🐟', imgUrl: '', desc: '外焦里嫩', title: '', subtitle: '' },
    { id: '13', name: '红烧肉', emoji: '🥩', imgUrl: '', desc: '肥而不腻', title: '', subtitle: '' },
    { id: '14', name: '酸菜鱼', emoji: '🐠', imgUrl: '', desc: '酸辣开胃', title: '', subtitle: '' },
    { id: '15', name: '宫保鸡丁', emoji: '🥜', imgUrl: '', desc: '花生脆香', title: '', subtitle: '' },
    { id: '16', name: '水煮肉片', emoji: '🫕', imgUrl: '', desc: '麻辣过瘾', title: '', subtitle: '' },
    { id: '17', name: '干锅花菜', emoji: '🥦', imgUrl: '', desc: '焦香脆嫩', title: '', subtitle: '' },
    { id: '18', name: '蒜蓉虾', emoji: '🦐', imgUrl: '', desc: '蒜香浓郁', title: '', subtitle: '' },
    { id: '19', name: '三文鱼刺身', emoji: '🍣', imgUrl: '', desc: '冰鲜入口', title: '', subtitle: '' },
    { id: '20', name: '咖喱饭', emoji: '🍛', imgUrl: '', desc: '浓郁咖喱', title: '', subtitle: '' },
  ],
};

const drinksData: PresetData = {
  title: '喝什么',
  titleColor: [0.3, 0.7, 0.95],
  data: [
    { id: '1', name: '珍珠奶茶', emoji: '🧋', imgUrl: '', desc: '经典奶茶', title: '', subtitle: '' },
    { id: '2', name: '美式咖啡', emoji: '☕', imgUrl: '', desc: '提神醒脑', title: '', subtitle: '' },
    { id: '3', name: '拿铁', emoji: '☕', imgUrl: '', desc: '奶香浓郁', title: '', subtitle: '' },
    { id: '4', name: '柠檬茶', emoji: '🍋', imgUrl: '', desc: '酸甜解渴', title: '', subtitle: '' },
    { id: '5', name: '椰子水', emoji: '🥥', imgUrl: '', desc: '清爽自然', title: '', subtitle: '' },
    { id: '6', name: '可乐', emoji: '🥤', imgUrl: '', desc: '气泡畅爽', title: '', subtitle: '' },
    { id: '7', name: '鲜榨橙汁', emoji: '🍊', imgUrl: '', desc: '维C满满', title: '', subtitle: '' },
    { id: '8', name: '抹茶拿铁', emoji: '🍵', imgUrl: '', desc: '日式抹茶', title: '', subtitle: '' },
    { id: '9', name: '芋泥波波', emoji: '🧋', imgUrl: '', desc: '香甜芋泥', title: '', subtitle: '' },
    { id: '10', name: '杨枝甘露', emoji: '🥭', imgUrl: '', desc: '港式甜饮', title: '', subtitle: '' },
  ],
};

const dessertData: PresetData = {
  title: '甜品',
  titleColor: [1.0, 0.5, 0.7],
  data: [
    { id: '1', name: '草莓蛋糕', emoji: '🍓', imgUrl: '', desc: '甜蜜草莓', title: '', subtitle: '' },
    { id: '2', name: '提拉米苏', emoji: '🍰', imgUrl: '', desc: '意式经典', title: '', subtitle: '' },
    { id: '3', name: '芒果班戟', emoji: '🥭', imgUrl: '', desc: '港式甜品', title: '', subtitle: '' },
    { id: '4', name: '双皮奶', emoji: '🍮', imgUrl: '', desc: '顺德双皮', title: '', subtitle: '' },
    { id: '5', name: '冰淇淋', emoji: '🍦', imgUrl: '', desc: '夏日甜蜜', title: '', subtitle: '' },
    { id: '6', name: '巧克力慕斯', emoji: '🍫', imgUrl: '', desc: '丝滑浓郁', title: '', subtitle: '' },
    { id: '7', name: '千层蛋糕', emoji: '🍰', imgUrl: '', desc: '层层酥皮', title: '', subtitle: '' },
    { id: '8', name: '舒芙蕾', emoji: '🧁', imgUrl: '', desc: '云朵口感', title: '', subtitle: '' },
    { id: '9', name: '红豆沙', emoji: '🫘', imgUrl: '', desc: '绵密香甜', title: '', subtitle: '' },
    { id: '10', name: '椰汁西米露', emoji: '🥥', imgUrl: '', desc: '热带甜饮', title: '', subtitle: '' },
  ],
};

const fruitData: PresetData = {
  title: '水果',
  titleColor: [0.2, 0.8, 0.3],
  data: [
    { id: '1', name: '草莓', emoji: '🍓', imgUrl: '', desc: '甜蜜多汁', title: '', subtitle: '' },
    { id: '2', name: '芒果', emoji: '🥭', imgUrl: '', desc: '热带甜蜜', title: '', subtitle: '' },
    { id: '3', name: '西瓜', emoji: '🍉', imgUrl: '', desc: '夏日必备', title: '', subtitle: '' },
    { id: '4', name: '葡萄', emoji: '🍇', imgUrl: '', desc: '酸甜可口', title: '', subtitle: '' },
    { id: '5', name: '蓝莓', emoji: '🫐', imgUrl: '', desc: '花青素满满', title: '', subtitle: '' },
    { id: '6', name: '樱桃', emoji: '🍒', imgUrl: '', desc: '红宝石般', title: '', subtitle: '' },
    { id: '7', name: '桃子', emoji: '🍑', imgUrl: '', desc: '水蜜桃甜', title: '', subtitle: '' },
    { id: '8', name: '苹果', emoji: '🍎', imgUrl: '', desc: '脆甜多汁', title: '', subtitle: '' },
    { id: '9', name: '橙子', emoji: '🍊', imgUrl: '', desc: '维C满满', title: '', subtitle: '' },
    { id: '10', name: '柠檬', emoji: '🍋', imgUrl: '', desc: '酸爽提神', title: '', subtitle: '' },
  ],
};

const snackData: PresetData = {
  title: '零食',
  titleColor: [0.9, 0.5, 0.1],
  data: [
    { id: '1', name: '薯片', emoji: '🥔', imgUrl: '', desc: '经典零食', title: '', subtitle: '' },
    { id: '2', name: '坚果', emoji: '🥜', imgUrl: '', desc: '健康美味', title: '', subtitle: '' },
    { id: '3', name: '巧克力', emoji: '🍫', imgUrl: '', desc: '丝滑甜蜜', title: '', subtitle: '' },
    { id: '4', name: '饼干', emoji: '🍪', imgUrl: '', desc: '酥脆可口', title: '', subtitle: '' },
    { id: '5', name: '爆米花', emoji: '🍿', imgUrl: '', desc: '电影院必备', title: '', subtitle: '' },
    { id: '6', name: '辣条', emoji: '🌶️', imgUrl: '', desc: '国民零食', title: '', subtitle: '' },
    { id: '7', name: '海苔', emoji: '🟢', imgUrl: '', desc: '香脆海味', title: '', subtitle: '' },
    { id: '8', name: '果冻', emoji: '🟩', imgUrl: '', desc: 'Q弹爽滑', title: '', subtitle: '' },
    { id: '9', name: '牛肉干', emoji: '🥩', imgUrl: '', desc: '嚼劲十足', title: '', subtitle: '' },
    { id: '10', name: '鱿鱼丝', emoji: '🦑', imgUrl: '', desc: '海鲜零食', title: '', subtitle: '' },
  ],
};

const testurlData: PresetData = {
  title: '测试数据',
  titleColor: [0.3, 0.9, 0.5],
  data: [
    { id: '1', name: '雨琪', emoji: '', imgUrl: 'https://nametoavatar.com/_next/image?url=https%3A%2F%2Fimages.nametoavatar.com%2Favatars%2F70cf4601-4801-4329-9d0a-2517d8583fe3.png&w=1024&q=75', desc: '', title: '前端工程师', subtitle: '' },
    { id: '2', name: '韩涵', emoji: '', imgUrl: 'https://nametoavatar.com/_next/image?url=https%3A%2F%2Fimages.nametoavatar.com%2Favatars%2Fbb5c44e8-94e8-4b7c-aab6-90f13116a4c1.png&w=480&q=75', desc: '', title: '作家', subtitle: '' },
    { id: '3', name: 'Aroha Tūhoe', emoji: '', imgUrl: 'https://nametoavatar.com/_next/image?url=https%3A%2F%2Fimages.nametoavatar.com%2Favatars%2F3b822700-cb94-4143-8bee-800c224984d2.png&w=480&q=75', desc: '', title: '设计师', subtitle: '' },
    { id: '4', name: 'lee jieyun', emoji: '', imgUrl: 'https://nametoavatar.com/_next/image?url=%2Favatars%2Flee-ji-eun.png&w=480&q=75', desc: '', title: '产品经理', subtitle: '' },
    { id: '5', name: 'uchiha', emoji: '', imgUrl: 'https://nametoavatar.com/_next/image?url=%2Favatars%2Fsaske-uchiha.png&w=480&q=75', desc: '', title: '工程师', subtitle: '' },
    { id: '6', name: 'marco benedetti', emoji: '', imgUrl: 'https://nametoavatar.com/_next/image?url=%2Favatars%2Fmarco-benedetti.png&w=480&q=75', desc: '', title: '市场经理', subtitle: '' },
    { id: '7', name: 'Yuting Cai', emoji: '', imgUrl: 'https://nametoavatar.com/_next/image?url=%2Favatars%2Fyuting-cai.png&w=480&q=75', desc: '', title: '数据分析师', subtitle: '' },
    { id: '8', name: 'Keisha Baptiste', emoji: '', imgUrl: 'https://nametoavatar.com/_next/image?url=%2Favatars%2Fkeisha-baptiste.png&w=480&q=75', desc: '', title: '运营专员', subtitle: '' },
  ],
};

export const presets: Record<string, PresetData> = {
  food: foodData,
  drinks: drinksData,
  dessert: dessertData,
  fruit: fruitData,
  snack: snackData,
  testurl: testurlData,
};

export const presetKeys = Object.keys(presets);
