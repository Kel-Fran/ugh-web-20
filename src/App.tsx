import { useState } from "react";

const PAGE_TYPES = ['home', 'admin', 'moderator'] as const;
type PageType = typeof PAGE_TYPES[number];

interface Place {
  name: string;
  description: string;
  petsAllowed: boolean;
  price: number;
}

interface PlaceCRUDOps {
  get places(): Place[];
  set places(value: Place[]);
  createPlace(place: Place): void;
  deletePlace(place: Place): void;
  editPlace(place: Place, newValue: Place): void;
}

type PlaceDisplayTableProps = PlaceCRUDOps & {
  allowDelete?: boolean;
  editableProperties?: (keyof Place)[];
};

function PropertyEditor<T, K extends keyof T>(o: T, k: K, setter: (v: T[K]) => void) {
  if (typeof o[k] === 'boolean') {
    return <input type="checkbox" checked={o[k] as boolean} onChange={(e) => setter(e.target.checked as T[K])} />;
  } else if (typeof o[k] === 'number') {
    return <input type="number" value={o[k] as number} onChange={(e) => setter(Number(e.target.value) as T[K])} />;
  } else {
    return <input type="text" value={o[k] as string} onChange={(e) => setter(e.target.value as T[K])} />;
  }
}

function PlaceDisplayTable({ places, deletePlace, editPlace, allowDelete = false, editableProperties = [] }: PlaceDisplayTableProps) {
  return <table className="table table-striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Pets Allowed</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      {places.map((it, idx) => (
        <tr key={idx}>
          {(['name', 'description', 'petsAllowed', 'price'] as const).map((property, pidx) => (
            <td key={pidx}>
              {editableProperties.includes(property) ? (
                PropertyEditor(it, property, (newValue) => {
                  editPlace(it, { ...it, [property]: newValue });
                })
              ) : (
                it[property].toString()
              )}
            </td>
          ))}
          {allowDelete && (
            <td>
              <button className="btn btn-danger" onClick={() => deletePlace(it)}>Delete</button>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>;
}

function Home(ops: PlaceCRUDOps) {
  return <main>
    <article>
      <div className="container">
        <div className="row">
          <div className="col">
            <PlaceDisplayTable {...ops} />
          </div>
        </div>
      </div>
    </article>
  </main>
}

function Admin(ops: PlaceCRUDOps) {
  return <main>
    <article>
      <div className="container">
        <div className="row">
          <div className="col">
            <PlaceDisplayTable {...ops} editableProperties={['name', 'description', 'petsAllowed', 'price']} allowDelete />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const place: Place = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                petsAllowed: formData.get('petsAllowed') === 'on',
                price: Number(formData.get('price')),
              };
              ops.createPlace(place);
              form.reset();
            }}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" name="name" required />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <input type="text" className="form-control" id="description" name="description" required />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="petsAllowed" name="petsAllowed" />
                <label className="form-check-label" htmlFor="petsAllowed">Pets Allowed</label>
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Price</label>
                <input type="number" className="form-control" id="price" name="price" required />
              </div>
              <button type="submit" className="btn btn-primary">Add Place</button>
            </form>
          </div>
        </div>
      </div>
    </article>
  </main>
}

function Moderator(ops: PlaceCRUDOps) {
  return <main>
    <article>
      <div className="container">
        <div className="row">
          <div className="col">
            <PlaceDisplayTable {...ops} editableProperties={['petsAllowed']} />
          </div>
        </div>
      </div>
    </article>
  </main>
}

const PAGE_COMPONENTS = {
  home: Home,
  admin: Admin,
  moderator: Moderator,
} as const;

export default function App() {
  const [page, setPage] = useState<PageType>('home');
  const Page = PAGE_COMPONENTS[page];
  const [palces, setPlaces] = useState<Place[]>([
    {
      name: 'Place 1',
      description: 'Description 1',
      petsAllowed: true,
      price: 100,
    },
    {
      name: 'Place 2',
      description: 'Description 2',
      petsAllowed: false,
      price: 200,
    },
    {
      name: 'Place 3',
      description: 'Description 3',
      petsAllowed: true,
      price: 300,
    },
    {
      name: 'Place 4',
      description: 'Description 4',
      petsAllowed: false,
      price: 400,
    },
    {
      name: 'Place 5',
      description: 'Description 5',
      petsAllowed: true,
      price: 500,
    }
  ]);

  return <>
    <header>
      {PAGE_TYPES.map((p) => (
        <button key={p} onClick={() => setPage(p)}>
          {p}
        </button>
      ))}
    </header>
    <Page {...{
      get places() {
        return palces;
      },
      set places(value) {
        setPlaces(value);
      },
      createPlace(place: Place) {
        setPlaces([...palces, place]);
      },
      deletePlace(place: Place) {
        setPlaces(palces.filter((p) => p !== place));
      },
      editPlace(place: Place, newValue: Place) {
        setPlaces(palces.map((p) => p === place ? newValue : p));
      }
    }} />
    <footer>
      VD 13E 11/02/26
    </footer>
  </>
}