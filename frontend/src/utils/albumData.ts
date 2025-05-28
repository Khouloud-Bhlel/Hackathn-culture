interface MediaItem {
  type: 'images' | 'videos' | '3d';
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  modelUrl?: string;
  details?: {
    period: string;
    location: string;
    material: string;
    dimensions: string | {
      width?: string;
      height?: string;
    };
    discovery?: string;
    historical_context?: string;
    institution?: {
      name: string;
      museum: string;
    };
    poem?: {
      latin: string;
      translation: string;
    };
    historical_significance?: string;
    elements?: string[];
    inscription?: string;
    trade_connections?: string;
    discovery_site?: string;
    production?: string;
    decorations?: string[];
    symbols?: string[];
    historical_insight?: string;
    story?: string;
    [key: string]: any;
  };
}

// Define model URLs for 3D artifacts
const MODEL_URLS = {
  SALAKTA_LION: '/3d_Models/salakta_lion_mosaic.glb',
  SULLECTHUM_STATIO: '/3d_Models/sullecthum_statio23.glb',
  ROMAN_LAMPS: '/3d_Models/Roman_Lamps_Salakta.glb'
};

// Function to get path to local images
const getLocalImagePath = (filename: string) => `/images/${filename}`;

/**
 * Utility function to get an artifact by its ID or title
 * Uses fuzzy matching to improve QR code scanning reliability
 */
export function getArtifactById(idOrTitle: string): MediaItem | null {
  // Normalize the input
  const normalizedInput = idOrTitle.toLowerCase().replace(/[-_\s]+/g, '').trim();
  
  // First try exact match by title or ID
  const exactMatch = mediaItems.find(item => {
    const itemTitle = item.title.toLowerCase().replace(/[-_\s]+/g, '').trim();
    return itemTitle === normalizedInput;
  });
  
  if (exactMatch) {
    return exactMatch;
  }
  
  // If no exact match, try matching by file name
  const fileMatch = mediaItems.find(item => {
    const filename = item.thumbnail.split('/').pop() || '';
    const id = filename.split('.')[0];
    return id === idOrTitle;
  });
  
  if (fileMatch) {
    return fileMatch;
  }
  
  // If still not found, check if idOrTitle contains type prefix
  if (idOrTitle.includes(':')) {
    const [type, id] = idOrTitle.split(':');
    
    if (type === 'video') {
      return mediaItems.find(item => {
        const filename = item.thumbnail.split('/').pop() || '';
        const itemId = filename.split('.')[0];
        return itemId === id && item.type === 'videos';
      }) || null;
    }
    
    if (type === 'model') {
      return mediaItems.find(item => {
        const filename = item.thumbnail.split('/').pop() || '';
        const itemId = filename.split('.')[0];
        return itemId === id && item.type === '3d';
      }) || null;
    }
  }
  
  // If no exact match, try fuzzy matching
  const fuzzyMatch = mediaItems.find(item => {
    const itemTitle = item.title.toLowerCase().replace(/[-_\s]+/g, '').trim();
    // Check if one is a substring of the other
    return itemTitle.includes(normalizedInput) || normalizedInput.includes(itemTitle);
  });
  
  return fuzzyMatch || null;
}

export const mediaItems: MediaItem[] = [
  {
    type: '3d',
    title: 'فسيفساء الأسد الضخمة من سولكتوم',
    description: 'تحفة فنية ضخمة من الفسيفساء الرومانية الأفريقية تصور أسداً بكامل هيبته، تعكس براعة الصناعة المحلية في القرن الثالث الميلادي. اكتشفت في فيلا رومانية فاخرة بسلقطة، وتُظهر التفاصيل الدقيقة لشعر اللبدة والعضلات التي تبرز قوة الحيوان.',
    thumbnail: getLocalImagePath('fa773ac1-56de-4378-91fb-5b529185e67d.jpeg'),
    date: '٢٠٢٤/٠٣/١٥',
    modelUrl: MODEL_URLS.SALAKTA_LION,
    details: {
      period: 'العصر الروماني (القرن 3 ميلادي)',
      location: 'موقع سولكتوم الأثري، سلقطة، تونس',
      material: 'فسيفساء من الحجر الجيري والزجاج',
      dimensions: {
        width: '4.5 أمتار',
        height: '3.2 أمتار'
      },
      discovery: 'عُثر عليها في 2015 ضمن حفريات المعهد الوطني للتراث',
      historical_context: 'تمثل الفسيفساء ثراء الطبقة الأرستقراطية في سولكتوم التي كانت من أهم الموانئ التجارية الرومانية في شمال أفريقيا',
      institution: {
        name: 'المعهد الوطني للتراث التونسي',
        museum: 'متحف سلقة الإقليمي'
      }
    }
  },
  {
    type: 'images',
    title: 'فسيفساء الحمامات الرومانية بسولكتوم',
    description: 'فسيفساء نادرة تحوي قصيدة لاتينية تصف متعة الاستحمام، تعكس الحياة الاجتماعية في الحمامات العامة الرومانية. تظهر براعة الحرفيين المحليين في المزج بين الأدب والفن التشكيلي.',
    thumbnail: getLocalImagePath('4ed0dd86-c549-40e7-a37a-a39ab2054b62.jpeg'),
    date: '٢٠٢٤/٠٣/١٢',
    details: {
      period: 'العصر الروماني (القرن 2-3 ميلادي)',
      location: 'حمامات سولكتوم العامة، تونس',
      material: 'فسيفساء من الحجر والزجاج الملون',
      dimensions: '2.8 × 1.9 متر',
      poem: {
        latin: "EN PERFECTA CITO BAIARV(m) GRATA VOLVPTAS...",
        translation: "ها هنا تُكتمل بسعادة متعة الحمام الساحرة..."
      },
      historical_significance: "تعد من أقدم النماذج المعروفة للشعر اللاتيني المنقوش على الفسيفساء في شمال أفريقيا"
    }
  },
  {
    type: '3d',
    title: 'نقابة تجار سولكتوم في أوستيا',
    description: 'نموذج ثلاثي الأبعاد لفسيفساء نقابة تجار سولكتوم في ميناء أوستيا، تظهر المنارة والسفن التجارية التي تربط المدينة بروما. تؤكد أهمية سولكتوم كمركز تجاري رئيسي في الحوض الغربي للبحر المتوسط.',
    thumbnail: getLocalImagePath('sullecthum_mosaic_ostia.jpeg'),
    date: '٢٠٢٤/٠٣/١٣',
    modelUrl: MODEL_URLS.SULLECTHUM_STATIO,
    details: {
      period: 'العصر الروماني (القرن 2 ميلادي)',
      location: 'ساحة النقابات، أوستيا، إيطاليا',
      material: 'فسيفساء من الحجر والزجاج الملون',
      dimensions: '1.8 × 2.2 متر',
      elements: [
        'منارة سولكتوم',
        'سفينتان تجاريتان',
        'رموز بحرية (دلافين، سرطان بحر)'
      ],
      inscription: "NAVICVLARI SYLLECTINI",
      trade_connections: "زيت الزيتون، الصوف، المنتجات الزراعية"
    }
  },
  {
    type: '3d',
    title: 'مجموعة المصابيح الزيتية الرومانية',
    description: 'مجموعة نادرة من المصابيح الفخارية المزخرفة تعود للقرن الأول إلى الرابع الميلادي، تظهر مزيجاً من التأثيرات الرومانية والفينيقية في زخارفها. استخدمت في الحياة اليومية والطقوس الجنائزية.',
    thumbnail: getLocalImagePath('salakta_roman_lamps_2023.jpeg'),
    date: '٢٠٢٤/٠٣/١٤',
    modelUrl: MODEL_URLS.ROMAN_LAMPS,
    details: {
      period: 'العصر الروماني (القرن 1-4 ميلادي)',
      location: 'سولكتوم، تونس',
      material: 'فخار مزخرف',
      dimensions: '10-15 سم',
      discovery_site: 'الحي السكني الشرقي، سولكتوم',
      production: 'ورشات محلية بتقنيات رومانية',
      
      decorations: [
        'رموز دينية (نبتون، تانيت)',
        'مشاهد صيد',
        'زخارف نباتية'
      ]
    }
  },
  {
    type: 'videos',
    title: 'النصب الجنائزي لبحار من سولكتوم',
    description: 'وثائقي عن النصب التذكاري لبحار من سولكتوم دفن في أوستيا، يظهر رمح نبتون والرموز البحرية التي تعكس مهنته. يشهد على حركة السكان والروابط التجارية عبر البحر المتوسط.',
    thumbnail: getLocalImagePath('8f87e511-92ab-4054-945c-84e1f324707c.jpeg'),
    date: '٢٠٢٤/٠٣/٠٢',
    details: {
      period: 'العصر الروماني (القرن 3 ميلادي)',
      location: 'مقبرة أوستيا، إيطاليا',
      material: 'رخام منحوت',
      dimensions: '1.5 × 0.8 متر',
      symbols: [
        'رمح نبتون الثلاثي',
        'سمكتان (رمز الخصوبة والحياة بعد الموت)',
        'النقش اللاتيني'
      ],
      historical_insight: 'يقدم معلومات عن الجالية السولكتينية في أوستيا'
    }
  },
  {
    type: 'images',
    title: 'النقوش الهيروغليفية: لغة الآلهة',
    description: 'نقوش هيروغليفية من معبد الكرنك تعود للأسرة 19 (1292-1189 ق.م)، تظهر تطور الكتابة من الرموز التصويرية إلى النظام الصوتي المعقد. هذه النقوش الملكية تسجل انتصارات رمسيس الثاني وتُظهر كيف كانت الهيروغليفية أداة للتواصل الديني والسياسي.',
    thumbnail: getLocalImagePath('a161da6b-253c-4a00-ac29-4dcb0a688d69.jpeg'),
    date: '٢٠٢٤/٠٣/١١',
    details: {
      period: 'المملكة الحديثة (الأسرة 19)',
      location: 'معبد الكرنك، الأقصر',
      material: 'حجر جرانيت منقوش',
      dimensions: '3.2م ارتفاع × 5م عرض',
      story: 'تمثل هذه النقوش ذروة تطور الهيروغليفية كلغة مقدسة للتواصل مع الآلهة. تحتوي على نصوص دينية من كتاب الموتى وتسجيلات تاريخية للمعارك، مكتوبة بأساليب فنية متقنة تدمج بين الصور والأصوات.'
    }
  },
  {
    type: 'videos',
    title: 'قصة المتحف المصري: حارس التراث الفرعوني',
    description: 'رحلة تأسيس المتحف المصري من الأزبكية 1835 إلى ميدان التحرير 1902، يرويها أرشيف نادر يعرض كفاح علماء مثل مارييت ضد نهب الآثار. يشمل الفيديو مقاطع تاريخية عن نقل مقتنيات توت عنخ آمون.',
    thumbnail: getLocalImagePath('79255007-ebd4-4265-a443-db0ebd6cc166.jpeg'),
    date: '٢٠٢٤/٠٣/١٠',
    details: {
      period: 'القرن 19-21',
      location: 'القاهرة',
      material: 'وثائق أرشيفية',
      dimensions: 'مدة الفيديو: 22 دقيقة',
      story: 'يحكي كيف أنقذ أوجوست مارييت الآثار من التهريب بإنشاء المتحف في بولاق 1858، ثم تطور المبنى الحالي الذي صممه مارسيل دورنون ليكون أول متحف حديث في الشرق الأوسط.'
    }
  },
  {
    type: 'images',
    title: 'تاج الملك بسوسنق الأول: رمز السلطة',
    description: 'تاج مرصع باللازورد والذهب من مقبرة بسوسنق الأول (الأسرة 21، 1047-1001 ق.م). يظهر التاج التقنيات المتقدمة في صياغة الذهب عند المصريين، مع زخارف مستوحاة من آلهة مثل حورس ونخبت.',
    thumbnail: getLocalImagePath('a56bdc62-1c47-4021-9549-edc4ac6024b3.jpeg'),
    date: '٢٠٢٤/٠٣/٠٩',
    details: {
      period: 'العصر الانتقال الثالث (الأسرة 21)',
      location: 'تانيس، الدلتا',
      material: 'ذهب، لازورد، أحجار شبه كريمة',
      dimensions: 'قطر 18سم، وزن 1.2كجم',
      story: 'اكتشف عام 1939 في مقبرة بسوسنق الأول سليلة الأسرة الكهنوتية. يرمز التاج إلى الوحدة بين الشمال والجنوب، مع ثعبان الكوبرا (الواريت) ونسر نخبة كحاميين للعرش.'
    }
  },
  {
    type: 'images',
    title: 'لوحة جدارية من مقبرة نفرتاري',
    description: 'لوحة من مقبرة الملكة نفرتاري (زوجة رمسيس الثاني) تصور مراسم تقديم القرابين للإلهة حتحور. تظهر براعة استخدام الألوان المعدنية المستخرجة من الطبيعة والتي حافظت على بهائها لـ3200 عام.',
    thumbnail: getLocalImagePath('b5b51605-1c17-40a4-b678-557251497897.jpeg'),
    date: '٢٠٢٤/٠٣/٠٨',
    details: {
      period: 'المملكة الحديثة (الأسرة 19)',
      location: 'وادي الملكات، الأقصر',
      material: 'ألوان معدنية على جص',
      dimensions: '1.8×1.2م',
      story: 'تمثل اللوحة ذروة الفن الجنائزي المصري، حيث تظهر الملكة وهي تقدم القرابين بحضور الآلهة. الألوان الزرقاء المستخلصة من اللازورد الأحمر من سيناء تمثل دماء الآلهة حسب المعتقدات القديمة.'
    }
  },
  {
    type: 'images',
    title: 'عملات بطلمية: مزيج الثقافات',
    description: 'مجموعة عملات ذهبية وفضية من العصر البطلمي (305-30 ق.م) تظهر تطور النقوش من الصور الفرعونية إلى الملامح الهلنستية، مع كتابات هيروغليفية ويونانية.',
    thumbnail: getLocalImagePath('e554eec8-8887-44f7-ad4c-223e3ce8fc94.jpeg'),
    date: '٢٠٢٤/٠٣/٠٧',
    details: {
      period: 'العصر البطلمي',
      location: 'الإسكندرية',
      material: 'ذهب، فضة، برونز',
      dimensions: '2-4سم قطر',
      story: 'تعكس العملات التحول الثقافي في مصر، حيث تظهر ملوك مثل كليوباترا السابعة بملامح مصرية-يونانية مختلطة. بعض القطع تحمل تاريخ حصاد النيل، مما يجعلها وثائق تاريخية.'
    }
  },
  {
    type: 'images',
    title: 'أدوات كتابة الكتبة: بين الحياة والدين',
    description: 'مجموعة أدوات كاتب من الأسرة 18 (1550-1292 ق.م) تشمل لوحة خشبية بألوان معدنية، أقلام بردى، ومحابر من الحجر. كانت هذه الأدوات مقدسة لأن الكتبة كانوا يعتبرون وسطاء بين البشر والآلهة.',
    thumbnail: getLocalImagePath('0897001c-bfd3-4099-9f5f-6a8799629397.jpeg'),
    date: '٢٠٢٤/٠٣/٠٦',
    details: {
      period: 'المملكة الحديثة',
      location: 'طيبة (الأقصر)',
      material: 'خشب، بردى، أصباغ معدنية',
      dimensions: 'لوحة 30×20سم'
    }
  },
  {
    type: 'videos',
    title: 'الحفريات الأثرية: كشف أسرار دهشور',
    description: 'توثيق حفريات بعثة 2023 في دهشور حيث اكتشفت مقابر جديدة تعود للأسرة الثالثة. يظهر الفيديو تقنيات التنقيب الحديثة وكيفية حفظ القطع الهشة.',
    thumbnail: getLocalImagePath('989c1827-a0ea-4184-afd6-e561579e2172.jpeg'),
    date: '٢٠٢٤/٠٣/٠١',
    details: {
      period: 'عصر الأسرات المبكر',
      location: 'دهشور، الجيزة',
      material: 'وثائق تنقيب',
      dimensions: 'مدة الفيديو: 30 دقيقة',
      story: 'يصور العمل اليومي للآثاريين من تنظيف القطع إلى التصوير ثلاثي الأبعاد. الاكتشاف الرئيسي كان بردية تحوي تعاويذ جنائزية غير معروفة سابقًا.'
    }
  },
  {
    type: 'videos',
    title: 'الآثار الفينيقية في سلقطة',
    description: 'فيديو يعرض الآثار الفينيقية النادرة في مدينة سلقطة (سولكتوم سابقاً) بتونس. يتضمن الفيديو مشاهد للأنقاض الأثرية التي تعود إلى العصر الفينيقي، مع شرح تفصيلي للخصائص المعمارية والتاريخية التي تميز هذه الحضارة التجارية العريقة في البحر المتوسط.',
    thumbnail: getLocalImagePath('9a245834-3207-4b43-90a9-00651d2faede.jpeg'),
    date: '٢٠٢٤/٠٢/٢٧',
    details: {
      period: 'العصر الفينيقي (القرن 7-4 ق.م)',
      location: 'سلقطة، تونس (سولكتوم الفينيقية)',
      material: 'أنقاض حجرية (معالم أثرية)',
      dimensions: 'غير محدد (موقع أثري)',
      story: 'تعد سلقطة واحدة من أهم الموانئ الفينيقية في شمال أفريقيا، حيث أسسها التجار الفينيقيون كقاعدة تجارية. تضم الأنقاض بقايا معابد ومخازن ومباني سكنية تعكس النشاط التجاري المكثف لتلك الحضارة التي سيطرت على تجارة البحر المتوسط لقرون طويلة.'
    }
  }
];

// Function to get the correct video file for a thumbnail
export const getVideoForThumbnail = (thumbnailPath: string): string => {
  // Map of video files available
  const videoFiles = [
    '164d8230-9b7c-4c64-99b5-3301f1b5ab58.mp4',
    '1def7a12-fc1b-44c0-a194-dce3b16d149f.mp4',
    '23dbabf0-23d0-485b-99e7-3f8b6f5ed1e7.mp4',
    '28d3fdb2-88a4-4c96-b20a-dd1a163e44fc.mp4',
    '51ed0e52-05c7-4b22-b77c-4ad7636c48da.mp4',
    '66280461-94ba-4f3e-b806-53424eef11f4.mp4',
    '68887ce9-f7b2-408a-a3be-4a6b7f45352c.mp4',
    '89e5cee0-56f3-4f75-9c2d-0e3761a6a931.mp4',
    '97ee7aab-6621-49d2-8fa3-3e59da5131e3.mp4',
    'cb546f94-b0c7-41fa-833c-ae5cf24f3748.mp4'
  ];
  
  // Extract file name from path
  const fileName = thumbnailPath.split('/').pop() || '';
  
  // Try to match filename without extension to a video file
  const fileBaseName = fileName.split('.')[0];
  
  // First check if the thumbnail filename exactly matches a video filename (without extension)
  const exactMatch = videoFiles.find(video => video.startsWith(fileBaseName + '.') || video.split('.')[0] === fileBaseName);
  if (exactMatch) {
    return `/videos/${exactMatch}`;
  }
  
  // Use a comprehensive mapping for specific thumbnails to videos
  const videoMap: { [key: string]: string } = {
    '79255007-ebd4-4265-a443-db0ebd6cc166.jpeg': '164d8230-9b7c-4c64-99b5-3301f1b5ab58.mp4',
    '8f87e511-92ab-4054-945c-84e1f324707c.jpeg': '23dbabf0-23d0-485b-99e7-3f8b6f5ed1e7.mp4',
    '989c1827-a0ea-4184-afd6-e561579e2172.jpeg': '28d3fdb2-88a4-4c96-b20a-dd1a163e44fc.mp4',
    '9a245834-3207-4b43-90a9-00651d2faede.jpeg': '51ed0e52-05c7-4b22-b77c-4ad7636c48da.mp4',
    // Add more mappings for remaining thumbnails
    'b7670c8f-c293-4c80-bbb5-ef8e9072707c.jpeg': '66280461-94ba-4f3e-b806-53424eef11f4.mp4',
    'c190c5e9-4b75-47f6-9ab1-31c7a105ff57.jpeg': '68887ce9-f7b2-408a-a3be-4a6b7f45352c.mp4',
    'd59c1a6c-77ca-4163-b4e7-5e1b5fef1769.jpeg': '89e5cee0-56f3-4f75-9c2d-0e3761a6a931.mp4',
    'e10ef5e7-61e7-4650-9ef3-e26fee7f78c6.jpeg': '97ee7aab-6621-49d2-8fa3-3e59da5131e3.mp4',
    'f7965f0b-1c52-48b2-84c6-1b903c82b8ef.jpeg': 'cb546f94-b0c7-41fa-833c-ae5cf24f3748.mp4',
    'ff2dd85a-baad-4aa0-b7ff-33a3a9dd1329.jpeg': '1def7a12-fc1b-44c0-a194-dce3b16d149f.mp4'
  };
  
  // If we have a direct mapping, use it
  if (videoMap[fileName]) {
    return `/videos/${videoMap[fileName]}`;
  }
  
  // Try alternative extension formats if the current one isn't found
  const extensionVariants = ['.jpg', '.jpeg', '.png'];
  for (const ext of extensionVariants) {
    const fileNameWithAltExt = fileBaseName + ext;
    if (videoMap[fileNameWithAltExt]) {
      return `/videos/${videoMap[fileNameWithAltExt]}`;
    }
  }
  
  // If no matching video found, provide a consistent default based on the thumbnail name
  // Use a hash of the filename to consistently select the same video for the same thumbnail
  const hashCode = fileBaseName.split('').reduce((acc, char) => (acc + char.charCodeAt(0)), 0);
  const videoIndex = Math.abs(hashCode) % videoFiles.length;
  
  console.log(`No direct mapping found for thumbnail: ${fileName}. Using fallback video: ${videoFiles[videoIndex]}`);
  return `/videos/${videoFiles[videoIndex]}`;
};