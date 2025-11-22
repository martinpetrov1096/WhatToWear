import type { WeatherDisplayProps } from '../types';

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="text-5xl font-extralight tracking-tight text-gray-800">
          {weather.temperature}°
        </div>
        <div className="border-l border-gray-200 pl-5">
          <div className="text-sm font-light tracking-wide text-gray-900">
            {weather.location}
          </div>
          <div className="text-xs text-gray-500 capitalize mt-0.5 tracking-wide">
            {weather.description}
          </div>
        </div>
      </div>
      <div className="text-right text-xs text-gray-400 space-y-0.5 tracking-wide">
        <div>Feels like {weather.feelsLike}°</div>
        <div>{weather.humidity}% humidity</div>
      </div>
    </div>
  );
}
