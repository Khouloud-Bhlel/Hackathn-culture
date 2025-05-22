import React, { useState } from 'react';
import { Info, Cuboid as Cube } from 'lucide-react';
import Scene3D from './3DModel';

const models = [
	{
		id: 1,
		name: 'تمثال نفرتيتي',
		image: 'https://images.pexels.com/photos/11149403/pexels-photo-11149403.jpeg',
		description: 'تمثال جنائزي صغير من العصر القديم',
		modelUrl: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/nefertiti-bust/model.gltf',
	},
	{
		id: 2,
		name: 'إناء فخاري',
		image: 'https://images.pexels.com/photos/12866053/pexels-photo-12866053.jpeg',
		description: 'إناء فخاري مزخرف بأنماط بدوية',
		modelUrl: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/vase/model.gltf',
	},
	{
		id: 3,
		name: 'قناع توت عنخ آمون',
		image: 'https://images.pexels.com/photos/5825605/pexels-photo-5825605.jpeg',
		description: 'قناع فرعوني ذهبي',
		modelUrl: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/golden-mask/model.gltf',
	},
	{
		id: 4,
		name: 'تمثال أثري',
		image: 'https://images.pexels.com/photos/6707628/pexels-photo-6707628.jpeg',
		description: 'تمثال أثري يعود للعصر الكلاسيكي',
		modelUrl: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/statue-scan/model.gltf',
	},
	{
		id: 5,
		name: 'مصباح زيت أثري',
		image: 'https://images.pexels.com/photos/4993246/pexels-photo-4993246.jpeg',
		description: 'مصباح زيت تقليدي من العصور القديمة كان يستخدم للإضاءة',
		modelUrl: '/3d_Models/Ancient_Oil_Lamp_0516193953_texture.glb',
	},
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
								{show3D[model.id] ? (
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
									>
										<Cube
											size={18}
											className={
												show3D[model.id] ? 'animate-spin' : ''
											}
										/>
									</button>

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
									<div className="absolute inset-0 bg-burgundy-900 bg-opacity-80 text-white p-4 flex flex-col justify-center items-center text-center transition-opacity">
										<h3 className="text-xl font-bold mb-2">
											{model.name}
										</h3>
										<p>{model.description}</p>
									</div>
								)}
							</div>

							<div className="p-4">
								<h3 className="font-bold text-burgundy-900">
									{model.name}
								</h3>
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