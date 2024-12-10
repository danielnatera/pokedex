import Image from "next/image";
import Pokeball from "../../assets/svg/Pokeball.svg";

export const Logo: React.FC = () => (
  <div className="flex items-center gap-6">
    <Image src={Pokeball} alt="Logo" width={50} height={50} />
    <div className="flex flex-col">
      <h1 className="text-xl font-bold text-5xl">Pokedex</h1>
      <p className="text-xs">By Daniel Natera</p>
    </div>
  </div>
);