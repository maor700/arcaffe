export interface Material {
  geo: string;
  type: string;
  image: string;
  id: string;
  displayName: string;
  interval: Interval;
  additionalProps: AdditionalProps;
}

interface AdditionalProps {
  email: string;
  url: string;
  phone: string;
}

interface Interval {
  start: string;
  end: string;
}

export interface User {
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
  id: string;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Geo {
  lat: string;
  lng: string;
}
