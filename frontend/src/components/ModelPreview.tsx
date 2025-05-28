import React, { useState } from 'react';
import { Info, Cuboid as Cube } from 'lucide-react';
import Scene3D from './3DModel';

interface ArtifactModel {
  id: number;
  name: string;
  image: string;
  description: string;
  modelUrl: string;
  date?: string;
  details?: {
    period?: string;
    location?: string;
    material?: string;
    dimensions?: string | { width?: string; height?: string };
    [key: string]: any;
  };
}

const models: ArtifactModel[] = [
  {
    id: 1,
    name: 'فسيفساء الأسد الضخمة من سولكتوم',
    image: '/images/fa773ac1-56de-4378-91fb-5b529185e67d.jpeg',
    description: 'تحفة فنية ضخمة من الفسيفساء الرومانية الأفريقية تصور أسداً بكامل هيبته',
    modelUrl: '/3d_Models/salakta_lion_mosaic.glb',
    date: '٢٠٢٤/٠٣/١٥',
    details: {
      period: 'العصر الروماني (القرن 3 ميلادي)',
      location: 'موقع سولكتوم الأثري، سلقطة، تونس',
      material: 'فسيفساء من الحجر الجيري والزجاج',
      dimensions: {
        width: '4.5 أمتار',
        height: '3.2 أمتار'
      }
    }
  },
  {
    id: 2,
    name: 'نقابة تجار سولكتوم في أوستيا',
    image: '/images/sullecthum_mosaic_ostia.jpeg',
    description: 'فسيفساء نقابة تجار سولكتوم في ميناء أوستيا، تظهر المنارة والسفن التجارية',
    modelUrl: '/3d_Models/sullecthum_statio23.glb',
    date: '٢٠٢٤/٠٣/١٣',
    details: {
      period: 'العصر الروماني (القرن 2 ميلادي)',
      location: 'ساحة النقابات، أوستيا، إيطاليا',
      material: 'فسيفساء حجرية',
      dimensions: '3.5 × 2.8 متر'
    }
  },
  {
    id: 3,
    name: 'مجموعة المصابيح الزيتية الرومانية',
    image: '/images/salakta_roman_lamps_2023.jpeg',
    description: 'مجموعة نادرة من المصابيح الفخارية المزخرفة تعود للقرن الأول إلى الرابع الميلادي',
    modelUrl: '/3d_Models/Roman_Lamps_Salakta.glb',
    date: '٢٠٢٤/٠٣/١٤',
    details: {
      period: 'العصر الروماني (القرن 1-4 ميلادي)',
      location: 'الحي السكني الشرقي، سولكتوم',
      material: 'فخار مزجج',
      decorations: ['رموز دينية', 'مشاهد صيد', 'زخارف نباتية']
    }
  },
  {
    id: 4,
    name: 'فسيفساء الحمامات الرومانية بسولكتوم',
    image: '/images/4ed0dd86-c549-40e7-a37a-a39ab2054b62.jpeg',
    description: 'فسيفساء نادرة تحوي قصيدة لاتينية تصف متعة الاستحمام',
    modelUrl: '',
    date: '٢٠٢٤/٠٣/١٢',
    details: {
      period: 'العصر الروماني (القرن 2-3 ميلادي)',
      location: 'حمامات سولكتوم العامة، تونس',
      material: 'فسيفساء من الحجر والزجاج الملون',
      dimensions: '2.8 × 1.9 متر'
    }
  },
  {
    id: 5,
    name: 'النقوش الهيروغليفية: لغة الآلهة',
    image: '/images/a161da6b-253c-4a00-ac29-4dcb0a688d69.jpeg',
    description: 'نقوش هيروغليفية من معبد الكرنك تعود للأسرة 19',
    modelUrl: '',
    date: '٢٠٢٤/٠٣/١١',
    details: {
      period: 'المملكة الحديثة (الأسرة 19)',
      location: 'معبد الكرنك، الأقصر',
      material: 'حجر جرانيت منقوش',
      dimensions: '3.2م ارتفاع × 5م عرض'
    }
  }
];

const ModelPreview: React.FC = () => {
  const [activeModel, setActiveModel] = useState<number | null>(null);
  const [show3D, setShow3D] = useState<{ [key: number]: boolean }>({});

  const toggle3D = (id: number) => {
    setShow3D((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleModelInfo = (id: number) => {
    setActiveModel(activeModel === id ? null : id);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="section-title">
          اكتشف القطع الأثرية بتقنية ثلاثية الأبعاد!
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {models.map((model) => (
            <div key={model.id} className="card relative group">
              <div className="aspect-square overflow-hidden relative">
                {show3D[model.id] && model.modelUrl ? (
                  <Scene3D modelUrl={model.modelUrl} className="bg-sand-50" />
                ) : (
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                )}

                {/* Controls */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {model.modelUrl && (
                    <button
                      onClick={() => toggle3D(model.id)}
                      className={`p-2 rounded-full ${
                        show3D[model.id]
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-burgundy-900'
                      } shadow-md hover:scale-105 transition-all`}
                      aria-label={
                        show3D[model.id]
                          ? 'عرض الصورة'
                          : 'عرض النموذج ثلاثي الأبعاد'
                      }
                      disabled={!model.modelUrl}
                    >
                      <Cube
                        size={18}
                        className={show3D[model.id] ? 'animate-spin' : ''}
                      />
                    </button>
                  )}

                  <button
                    onClick={() => toggleModelInfo(model.id)}
                    className={`p-2 rounded-full ${
                      activeModel === model.id
                        ? 'bg-pink-600 text-white'
                        : 'bg-white text-burgundy-900'
                    } shadow-md hover:scale-105 transition-all`}
                    aria-label="معلومات"
                  >
                    <Info size={18} />
                  </button>
                </div>

                {/* Info overlay */}
                {activeModel === model.id && (
                  <div className="absolute inset-0 bg-burgundy-900 bg-opacity-90 text-white p-4 flex flex-col justify-center items-center text-center transition-opacity overflow-y-auto">
                    <h3 className="text-xl font-bold mb-2">{model.name}</h3>
                    <p className="mb-2">{model.description}</p>
                    {model.date && <p className="text-sm opacity-80 mb-3">التاريخ: {model.date}</p>}
                    
                    {model.details && (
                      <div className="text-sm text-right w-full mt-2">
                        {model.details.period && <p><strong>الفترة التاريخية:</strong> {model.details.period}</p>}
                        {model.details.location && <p><strong>الموقع:</strong> {model.details.location}</p>}
                        {model.details.material && <p><strong>المادة:</strong> {model.details.material}</p>}
                        {model.details.dimensions && (
                          <p>
                            <strong>الأبعاد:</strong> {typeof model.details.dimensions === 'string' 
                              ? model.details.dimensions 
                              : `${model.details.dimensions.width} × ${model.details.dimensions.height}`}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-burgundy-900">{model.name}</h3>
                {model.date && <p className="text-sm text-gray-500 mt-1">{model.date}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button className="btn btn-primary flex items-center gap-2">
            عرض المزيد من القطع الأثرية
            <span className="inline-block transform rotate-180">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModelPreview;