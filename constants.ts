import { House, Language } from './types';

export const TRANSLATIONS = {
  en: {
    title: "LESLEY GU",
    subtitle: "Creative Portfolio",
    pressStart: "Press Space or Click to Start",
    exitBuilding: "Exit Building",
    viewLive: "View Live Project",
    currency: "G",
    dialogues: [
      "How can systems become more human, accessible, and trustworthy in everyday interaction?",
      "My work bridges AI engineering, accessibility research, and creative interaction design — making emerging technologies usable and meaningful.",
      "Welcome to my Work Town!"
    ],
    farmTitle: "LESLEY'S WORK TOWN",
    farmSubtitle: "WASD to Walk • Click Buildings to Enter",
    enterPrompt: "[E] ENTER"
  },
  cn: {
    title: "顾清 (Lesley)",
    subtitle: "创意作品集",
    pressStart: "按空格或点击开始",
    exitBuilding: "离开建筑",
    viewLive: "查看项目",
    currency: "金",
    dialogues: [
      "在日常交互中，系统如何能变得更具人性化、更易于访问且更值得信赖？",
      "我的工作桥接了人工智能工程、无障碍研究和创意交互设计——让新兴技术变得好用且有意义。",
      "欢迎来到我的工作小镇参观！"
    ],
    farmTitle: "顾清的工作小镇",
    farmSubtitle: "WASD 移动 • 点击建筑进入",
    enterPrompt: "[E] 进入"
  },
  sv: {
    title: "LESLEY GU",
    subtitle: "Kreativ Portfölj",
    pressStart: "Tryck på mellanslag eller klicka för att starta",
    exitBuilding: "Lämna byggnaden",
    viewLive: "Se projektet",
    currency: "G",
    dialogues: [
      "Hur kan system bli mer mänskliga, tillgängliga och pålitliga i vardaglig interaktion?",
      "Mitt arbete överbryggar AI-teknik, tillgänglighetsforskning och kreativ interaktionsdesign – vilket gör framväxande teknologier användbara och meningsfulla.",
      "Välkommen till min Arbetsstad!"
    ],
    farmTitle: "LESLEYS ARBETSSTAD",
    farmSubtitle: "WASD • Klicka byggnader",
    enterPrompt: "[E] GÅ IN"
  }
};

export const getLocalizedHouses = (lang: Language): House[] => {
  const isCN = lang === 'cn';
  const isSV = lang === 'sv';

  return [
    {
      id: 'ai-systems',
      category: isCN ? '交互式人工智能' : (isSV ? 'Interaktiva AI-system' : 'Interactive AI Systems'),
      description: isCN ? '以人为本的机器学习和智能接口。' : (isSV ? 'Människo-centrerad maskininlärning.' : 'Human-centered machine learning and intelligent interfaces.'),
      icon: 'house1.png',
      x: 20,
      y: 50,
      works: [
        { id: 'ai1', title: isCN ? '信任感知聊天机器人' : 'Trust-aware Chatbots', description: isCN ? '探索用户对大语言模型的信任度。' : 'Exploring user trust in LLMs.', imageUrl: 'https://picsum.photos/400/300?sig=1', tags: ['Python', 'React'] },
        { id: 'ai2', title: isCN ? '手势AI' : 'Gestural AI', description: isCN ? '用于音乐控制的实时手部追踪。' : 'Real-time hand tracking for music control.', imageUrl: 'https://picsum.photos/400/300?sig=2', tags: ['Mediapipe', 'Wekinator'] }
      ]
    },
    {
      id: 'accessibility',
      category: isCN ? '无障碍与包容性设计' : (isSV ? 'Tillgänglighet' : 'Accessibility & Inclusive Design'),
      description: isCN ? '赋能每个人的技术，无论能力如何。' : (isSV ? 'Teknik som stärker alla.' : 'Tech that empowers everyone, regardless of ability.'),
      icon: 'house2.png',
      x: 35,
      y: 50,
      works: [
        { id: 'acc1', title: isCN ? '触觉地图' : 'Haptic Maps', description: isCN ? '为视觉障碍者提供的导航辅助。' : 'Navigational aids for the visually impaired.', imageUrl: 'https://picsum.photos/400/300?sig=3', tags: ['Hardware', 'UX'] },
        { id: 'acc2', title: isCN ? '语音转手语' : 'Voice-to-Sign', description: isCN ? '将语音转化为手语视觉化。' : 'Translating speech to ASL visualizations.', imageUrl: 'https://picsum.photos/400/300?sig=4', tags: ['OpenAI', '3D'] }
      ]
    },
    {
      id: 'hci',
      category: isCN ? '人机交互研究' : (isSV ? 'HCI-forskning' : 'HCI Research'),
      description: isCN ? '实验性系统与交互原型。' : (isSV ? 'Experimentella system.' : 'Experimental systems and interaction prototypes.'),
      icon: 'house3.png',
      x: 50,
      y: 50,
      works: [
        { id: 'res1', title: isCN ? '生物反馈艺术' : 'Bio-Feedback Art', description: isCN ? '脑电波驱动的生成式视觉。' : 'EEG-driven generative visuals.', imageUrl: 'https://picsum.photos/400/300?sig=5', tags: ['Neuroscience', 'Processing'] }
      ]
    },
    {
      id: 'shorts',
      category: isCN ? '认知心理学简案' : (isSV ? 'Kognition & Psykologi' : 'Shorts (Psych/Cognition)'),
      description: isCN ? '关于人类认知和行为心理的案例研究。' : (isSV ? 'Studier i mänsklig kognition.' : 'Case studies in human cognition and behavioral psychology.'),
      icon: 'house5.png',
      x: 65,
      y: 50,
      works: [
        { id: 'psy1', title: isCN ? '注意力疲劳' : 'Attention Fatigue', description: isCN ? '关于VR中数字倦怠的研究。' : 'Study on digital burnout in VR.', imageUrl: 'https://picsum.photos/400/300?sig=6', tags: ['Statistics', 'Ethics'] }
      ]
    },
    {
      id: 'graphics',
      category: isCN ? '海报与图形' : (isSV ? 'Grafik & Design' : 'Posters & Graphics'),
      description: isCN ? '平面设计、书籍封面和游戏资产。' : (isSV ? 'Grafisk design och spelresurser.' : 'Graphic design, book covers, and game assets.'),
      icon: 'house4.png',
      x: 80,
      y: 50,
      works: [
        { id: 'graph1', title: isCN ? '像素UI包' : 'Pixel UI Pack', description: isCN ? '自定义像素艺术UI组件。' : 'Custom pixel art UI components.', imageUrl: 'https://picsum.photos/400/300?sig=7', tags: ['Pixel Art', 'Aseprite'] }
      ]
    }
  ];
};