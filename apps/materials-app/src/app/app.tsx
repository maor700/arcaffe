import { IMaterial, Material } from '@arcaffe/store';
import { useEffect, useState } from 'react';

const URL_MATERIALS = 'http://localhost:8080/api/materials';

interface AdditionalProps {
  email: string;
  url: string;
  phone: string;
}

export function App() {
  const [materials, setMaterials] = useState<IMaterial<AdditionalProps>[]>([]);
  useEffect(() => {
    fetch(URL_MATERIALS)
      .then((res) => res.json())
      .then((data) => {
        setMaterials(data);
      });
  }, []);

  return (
    <div className="materials-list">
      {materials?.map(({ displayName, additionalProps }) => (
        <div className={'materialrow'}>
          <div className="name">{displayName}</div>
          <div className="left">
            <div className="email">{additionalProps?.email}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
