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
    dimensions: string;
    story: string;
  };
}

// Define model URLs for 3D artifacts
const MODEL_URLS = {
  NEFERTITI: '/3d_Models/nefertiti.glb',
  VASE: '/3d_Models/Ancient_Oil_Lamp_0516193953_texture.glb',
  GOLDEN_MASK: '/3d_Models/golden_mask.glb'
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
    title: 'تمثال نفرتيتي',
    description: 'تمثال نادر يعود للعصر الفرعوني',
    thumbnail: getLocalImagePath('54d87251-629a-4f20-8531-59e5fc7e5aa9.jpeg'),
    date: '٢٠٢٤/٠٣/١٥',
    modelUrl: MODEL_URLS.NEFERTITI,
    details: {
      period: 'العصر الفرعوني الحديث - الأسرة الثامنة عشر',
      location: 'تل العمارنة، مصر',
      material: 'حجر جيري ملون',
      dimensions: '٥٠ سم × ٢٥ سم × ٣٥ سم',
      story: 'يعد تمثال نفرتيتي من أشهر القطع الأثرية المصرية القديمة. يمثل زوجة الفرعون إخناتون وقد تم اكتشافه في عام ١٩١٢ في ورشة النحات ثوتمس في تل العمارنة.'
    }
  },
  {
    type: '3d',
    title: 'إناء فخاري',
    description: 'إناء فخاري مزخرف بأنماط بدوية',
    thumbnail: getLocalImagePath('9ce4d8f3-d071-4184-afb7-1e9655d4a80c.jpeg'),
    date: '٢٠٢٤/٠٣/١٤',
    modelUrl: MODEL_URLS.VASE,
    details: {
      period: 'العصر البطلمي',
      location: 'الإسكندرية، مصر',
      material: 'فخار مزجج',
      dimensions: '٣٠ سم × ٢٠ سم × ٢٠ سم',
      story: 'تم العثور على هذا الإناء في موقع أثري بالإسكندرية. يتميز بزخارفه الفريدة التي تجمع بين الأنماط المصرية القديمة والتأثيرات اليونانية.'
    }
  },
  {
    type: '3d',
    title: 'قناع توت عنخ آمون',
    description: 'قناع فرعوني ذهبي',
    thumbnail: getLocalImagePath('95854e3d-c03d-41fd-bf70-1db714787537.jpeg'),
    date: '٢٠٢٤/٠٣/١٣',
    modelUrl: MODEL_URLS.GOLDEN_MASK,
    details: {
      period: 'الأسرة الثامنة عشر - العصر الفرعوني الحديث',
      location: 'وادي الملوك، الأقصر',
      material: 'ذهب خالص ومينا وأحجار كريمة',
      dimensions: '٥٤ سم × ٣٩.٣ سم × ٤٩ سم',
      story: 'يعتبر قناع توت عنخ آمون من أشهر الآثار المصرية على الإطلاق. تم اكتشافه في عام ١٩٢٢ في مقبرة الفرعون الشاب توت عنخ آمون.'
    }
  },
  {
    type: 'images',
    title: 'مجموعة الفخار',
    description: 'مجموعة من الأواني الفخارية النادرة',
    thumbnail: getLocalImagePath('4ed0dd86-c549-40e7-a37a-a39ab2054b62.jpeg'),
    date: '٢٠٢٤/٠٣/١٢'
  },
  {
    type: 'images',
    title: 'النقوش الهيروغليفية',
    description: 'نقوش هيروغليفية على جدار المعبد',
    thumbnail: getLocalImagePath('a161da6b-253c-4a00-ac29-4dcb0a688d69.jpeg'),
    date: '٢٠٢٤/٠٣/١١'
  },
  {
    type: 'videos',
    title: 'قصة المتحف',
    description: 'فيديو وثائقي عن تاريخ المتحف',
    thumbnail: getLocalImagePath('79255007-ebd4-4265-a443-db0ebd6cc166.jpeg'),
    date: '٢٠٢٤/٠٣/١٠'
  },
  {
    type: 'images',
    title: 'تاج الملك',
    description: 'تاج ملكي مزين بالأحجار الكريمة',
    thumbnail: getLocalImagePath('a56bdc62-1c47-4021-9549-edc4ac6024b3.jpeg'),
    date: '٢٠٢٤/٠٣/٠٩'
  },
  {
    type: 'images',
    title: 'لوحة جدارية',
    description: 'لوحة جدارية تصور حياة الملوك',
    thumbnail: getLocalImagePath('b5b51605-1c17-40a4-b678-557251497897.jpeg'),
    date: '٢٠٢٤/٠٣/٠٨'
  },
  {
    type: 'images',
    title: 'عملات قديمة',
    description: 'مجموعة من العملات الذهبية والفضية',
    thumbnail: getLocalImagePath('e554eec8-8887-44f7-ad4c-223e3ce8fc94.jpeg'),
    date: '٢٠٢٤/٠٣/٠٧'
  },
  {
    type: 'images',
    title: 'أدوات كتابة قديمة',
    description: 'أقلام وأدوات كتابة تعود للعصر القديم',
    thumbnail: getLocalImagePath('0897001c-bfd3-4099-9f5f-6a8799629397.jpeg'),
    date: '٢٠٢٤/٠٣/٠٦'
  },
  {
    type: 'images',
    title: 'الصندوق الذهبي',
    description: 'صندوق مزخرف بالذهب والأحجار الكريمة',
    thumbnail: getLocalImagePath('0a403a17-d520-4eb3-8e7f-776d6afdb7eb.jpeg'),
    date: '٢٠٢٤/٠٣/٠٥'
  },
  {
    type: 'images',
    title: 'مومياء فرعونية',
    description: 'مومياء محفوظة بشكل جيد',
    thumbnail: getLocalImagePath('32fda20c-c9bd-4aab-b2cf-e0e33454efda.jpeg'),
    date: '٢٠٢٤/٠٣/٠٤'
  },
  {
    type: 'videos',
    title: 'اكتشاف مقبرة توت عنخ آمون',
    description: 'قصة اكتشاف المقبرة الشهيرة',
    thumbnail: getLocalImagePath('8647f546-091f-4e39-a4d5-0cc647c2652c.jpeg'),
    date: '٢٠٢٤/٠٣/٠٣'
  },
  {
    type: 'videos',
    title: 'ترميم الآثار',
    description: 'كيف يتم ترميم القطع الأثرية القديمة',
    thumbnail: getLocalImagePath('8f87e511-92ab-4054-945c-84e1f324707c.jpeg'),
    date: '٢٠٢٤/٠٣/٠٢'
  },
  {
    type: 'videos',
    title: 'الحفريات الأثرية',
    description: 'خلف الكواليس: عمليات التنقيب عن الآثار',
    thumbnail: getLocalImagePath('989c1827-a0ea-4184-afd6-e561579e2172.jpeg'),
    date: '٢٠٢٤/٠٣/٠١'
  },
  {
    type: 'videos',
    title: 'أسرار الأهرامات',
    description: 'حقائق مدهشة عن بناء الأهرامات',
    thumbnail: getLocalImagePath('9a245834-3207-4b43-90a9-00651d2faede.jpeg'),
    date: '٢٠٢٤/٠٢/٢٧'
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
  
  // Mapping specific thumbnails to videos
  const videoMap: { [key: string]: string } = {
    '79255007-ebd4-4265-a443-db0ebd6cc166.jpeg': '164d8230-9b7c-4c64-99b5-3301f1b5ab58.mp4',
    '8647f546-091f-4e39-a4d5-0cc647c2652c.jpeg': '1def7a12-fc1b-44c0-a194-dce3b16d149f.mp4',
    '8f87e511-92ab-4054-945c-84e1f324707c.jpeg': '23dbabf0-23d0-485b-99e7-3f8b6f5ed1e7.mp4',
    '989c1827-a0ea-4184-afd6-e561579e2172.jpeg': '28d3fdb2-88a4-4c96-b20a-dd1a163e44fc.mp4',
    '9a245834-3207-4b43-90a9-00651d2faede.jpeg': '51ed0e52-05c7-4b22-b77c-4ad7636c48da.mp4'
  };
  
  // Extract file name from path
  const fileName = thumbnailPath.split('/').pop() || '';
  
  // If we have a direct mapping, use it
  if (videoMap[fileName]) {
    return `/images/${videoMap[fileName]}`;
  }
  
  // Otherwise use a default video
  return `/images/${videoFiles[0]}`;
};