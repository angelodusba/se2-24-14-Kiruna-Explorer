interface Point {
  lat: number;
  lng: number;
}

export interface Area {
  id: number;
  name: string;
  location: Point[];
}
