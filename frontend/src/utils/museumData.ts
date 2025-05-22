export interface Artifact {
  id: number;
  name: string;
  description: string;
  year: string;
  imageUrl: string;
  type: 'pottery' | 'statue' | 'mosaic' | 'tool' | 'jewelry';
  hasStory: boolean;
  has3DModel: boolean;
}

export const artifacts: Artifact[] = [
  {
    id: 1,
    name: 'إناء فخاري مزخرف',
    description: 'إناء فخاري يعود للعصر الروماني مع زخارف هندسية متقنة',
    year: 'القرن الثالث الميلادي',
    imageUrl: 'https://images.pexels.com/photos/12871557/pexels-photo-12871557.jpeg',
    type: 'pottery',
    hasStory: true,
    has3DModel: true
  },
  {
    id: 2,
    name: 'تمثال رأس نسائي',
    description: 'تمثال رأس امرأة من الرخام، يُعتقد أنه يمثل إحدى الشخصيات المهمة',
    year: 'القرن الثاني الميلادي',
    imageUrl: 'https://images.pexels.com/photos/134402/pexels-photo-134402.jpeg',
    type: 'statue',
    hasStory: true,
    has3DModel: true
  },
  {
    id: 3,
    name: 'فسيفساء الأسد',
    description: 'لوحة فسيفساء تصور أسداً وزخارف نباتية، تم اكتشافها في أرضية قصر قديم',
    year: '250-300 م',
    imageUrl: 'https://images.pexels.com/photos/5825370/pexels-photo-5825370.jpeg',
    type: 'mosaic',
    hasStory: true,
    has3DModel: false
  },
  {
    id: 4,
    name: 'حلي ذهبية',
    description: 'مجموعة من الحلي الذهبية تشمل أقراط وخواتم بزخارف دقيقة',
    year: 'القرن الرابع الميلادي',
    imageUrl: 'https://images.pexels.com/photos/10513822/pexels-photo-10513822.jpeg',
    type: 'jewelry',
    hasStory: false,
    has3DModel: true
  },
  {
    id: 5,
    name: 'مصباح زيتي',
    description: 'مصباح فخاري صغير كان يستخدم للإضاءة بزيت الزيتون',
    year: '150-200 م',
    imageUrl: 'https://images.pexels.com/photos/6153964/pexels-photo-6153964.jpeg',
    type: 'tool',
    hasStory: true,
    has3DModel: false
  },
  {
    id: 6,
    name: 'أدوات زراعية',
    description: 'مجموعة من الأدوات البرونزية كانت تستخدم في الزراعة',
    year: 'القرن الثالث الميلادي',
    imageUrl: 'https://images.pexels.com/photos/296230/pexels-photo-296230.jpeg',
    type: 'tool',
    hasStory: false,
    has3DModel: false
  }
];

export interface Story {
  id: number;
  artifactId: number;
  title: string;
  summary: string;
  audioUrl: string;
  durationSeconds: number;
}

export const stories: Story[] = [
  {
    id: 1,
    artifactId: 1,
    title: 'سر الإناء المزخرف',
    summary: 'اكتُشف هذا الإناء مدفوناً تحت منزل قديم مع رسالة مشفرة على قاعدته',
    audioUrl: '/audio/pottery-story.mp3',
    durationSeconds: 90
  },
  {
    id: 2,
    artifactId: 2,
    title: 'حكاية الملكة المنسية',
    summary: 'يُعتقد أن هذا التمثال يصور ملكة مهمة اختفت قصتها من السجلات التاريخية',
    audioUrl: '/audio/queen-story.mp3',
    durationSeconds: 120
  },
  {
    id: 3,
    artifactId: 3,
    title: 'لغز الأسد الذهبي',
    summary: 'تخفي هذه الفسيفساء إشارات وكلمات سرية كانت تستخدم للتواصل بين أفراد القبيلة',
    audioUrl: '/audio/lion-story.mp3',
    durationSeconds: 105
  },
  {
    id: 4,
    artifactId: 5,
    title: 'مصباح الأسرار',
    summary: 'كان هذا المصباح يستخدم في طقوس خاصة للتواصل مع الآلهة والتنبؤ بالمستقبل',
    audioUrl: '/audio/lamp-story.mp3',
    durationSeconds: 75
  }
];

export interface MuseumStat {
  label: string;
  value: string;
  icon: string;
}

export const museumStats: MuseumStat[] = [
  {
    label: 'قصة غامضة',
    value: '٣٠+',
    icon: 'book'
  },
  {
    label: 'زيارة افتراضية',
    value: '١٠٠٠+',
    icon: 'users'
  },
  {
    label: 'نموذج ثلاثي الأبعاد',
    value: '٥٠+',
    icon: 'cube'
  }
];