import { ItemsList } from "../components/ItemsList"

export function HomePage() {
  return (
    <div>
    <ItemsList isService={true} title={'Servicios'}/>
    <ItemsList isService={false} title={"Trabajos"}/>
    </div>
  )
}