import { TerminalIcon } from "@heroicons/react/outline";
const Header = () => {
  return (
    <header>
      <div>
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
