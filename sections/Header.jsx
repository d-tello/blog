import { TerminalIcon } from "@heroicons/react/outline";

const Header = () => {
  return (
    <header className="border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <p className="flex items-center space-x-1 text-blue-600">
          <TerminalIcon className="w-8 h-8 flex-shrink-0" />
          <span className="font-bold text-lg tracking-tight whitespace-nowrap">
            Blog
          </span>
        </p>
      </div>
    </header>
  );
};

export default Header;
