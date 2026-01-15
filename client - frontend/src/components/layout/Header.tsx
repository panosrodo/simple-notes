import { AuthButton } from "../AuthButton";

const Header = () => {
  return (
    <>
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Simple Notes</h2>
      <nav className="flex gap-4 text-black font-medium"> 
        <AuthButton />
      </nav>
    </div>
    </>
  )
}
export default Header;