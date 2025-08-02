import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface GameStats {
  health: number;
  energy: number;
  money: number;
  happiness: number;
  age: number;
  level: number;
}

interface Location {
  id: string;
  name: string;
  description: string;
  icon: string;
  actions: LocationAction[];
  position: { x: number; y: number };
}

interface LocationAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  consequences: {
    health?: number;
    energy?: number;
    money?: number;
    happiness?: number;
  };
  cost?: {
    energy?: number;
    money?: number;
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

interface InventoryItem {
  id: string;
  name: string;
  type: string;
  value: number;
  icon: string;
}

interface LifeEvent {
  id: string;
  title: string;
  description: string;
  choices: {
    text: string;
    consequences: {
      health?: number;
      energy?: number;
      money?: number;
      happiness?: number;
    };
  }[];
}

const RealLifeGame = () => {
  const [gameStats, setGameStats] = useState<GameStats>({
    health: 85,
    energy: 70,
    money: 2500,
    happiness: 75,
    age: 25,
    level: 3
  });

  const [currentEvent, setCurrentEvent] = useState<LifeEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>('home');
  const [playerPosition, setPlayerPosition] = useState({ x: 250, y: 200 });

  const achievements: Achievement[] = [
    { id: '1', title: 'Первая работа', description: 'Устроился на первую работу', unlocked: true, icon: 'Briefcase' },
    { id: '2', title: 'Покупка машины', description: 'Купил первую машину', unlocked: true, icon: 'Car' },
    { id: '3', title: 'Переезд', description: 'Переехал в новую квартиру', unlocked: false, icon: 'Home' },
    { id: '4', title: 'Повышение', description: 'Получил повышение на работе', unlocked: false, icon: 'TrendingUp' }
  ];

  const inventory: InventoryItem[] = [
    { id: '1', name: 'Смартфон iPhone 15', type: 'Электроника', value: 1200, icon: 'Smartphone' },
    { id: '2', name: 'Водительские права', type: 'Документы', value: 0, icon: 'CreditCard' },
    { id: '3', name: 'Кожаная куртка', type: 'Одежда', value: 300, icon: 'ShirtIcon' },
    { id: '4', name: 'Ключи от машины', type: 'Важное', value: 0, icon: 'Key' }
  ];

  const locations: Location[] = [
    {
      id: 'home',
      name: 'Дом',
      description: 'Ваш уютный дом, где можно отдохнуть и восстановить силы',
      icon: 'Home',
      position: { x: 250, y: 200 },
      actions: [
        { id: 'rest', name: 'Отдохнуть', description: '+30 энергии', icon: 'Bed', consequences: { energy: 30 } },
        { id: 'cook', name: 'Приготовить еду', description: '+3 здоровье', icon: 'ChefHat', consequences: { health: 3 }, cost: { money: 20 } },
        { id: 'watch_tv', name: 'Смотреть ТВ', description: '+5 счастье', icon: 'Tv', consequences: { happiness: 5 }, cost: { energy: 5 } }
      ]
    },
    {
      id: 'office',
      name: 'Офис',
      description: 'Место работы, где можно заработать деньги',
      icon: 'Building',
      position: { x: 450, y: 150 },
      actions: [
        { id: 'work', name: 'Работать', description: '+$200, -10 энергии', icon: 'Briefcase', consequences: { money: 200 }, cost: { energy: 10 } },
        { id: 'overtime', name: 'Переработка', description: '+$350, -25 энергии', icon: 'Clock', consequences: { money: 350 }, cost: { energy: 25 } },
        { id: 'meeting', name: 'Совещание', description: '+5 уровень', icon: 'Users', consequences: { happiness: 3 }, cost: { energy: 5 } }
      ]
    },
    {
      id: 'gym',
      name: 'Спортзал',
      description: 'Место для поддержания физической формы',
      icon: 'Dumbbell',
      position: { x: 150, y: 350 },
      actions: [
        { id: 'workout', name: 'Тренировка', description: '+10 здоровье, -15 энергия', icon: 'Dumbbell', consequences: { health: 10 }, cost: { energy: 15, money: 30 } },
        { id: 'cardio', name: 'Кардио', description: '+5 здоровье, -10 энергия', icon: 'Activity', consequences: { health: 5 }, cost: { energy: 10, money: 20 } },
        { id: 'trainer', name: 'Персональный тренер', description: '+15 здоровье', icon: 'UserCheck', consequences: { health: 15 }, cost: { energy: 20, money: 100 } }
      ]
    },
    {
      id: 'mall',
      name: 'Торговый центр',
      description: 'Место для покупок и развлечений',
      icon: 'ShoppingBag',
      position: { x: 350, y: 320 },
      actions: [
        { id: 'shop_clothes', name: 'Купить одежду', description: '+10 счастье', icon: 'Shirt', consequences: { happiness: 10 }, cost: { money: 150 } },
        { id: 'eat_out', name: 'Поесть в ресторане', description: '+8 счастье, +5 здоровье', icon: 'Utensils', consequences: { happiness: 8, health: 5 }, cost: { money: 80 } },
        { id: 'cinema', name: 'Кино', description: '+12 счастье', icon: 'Film', consequences: { happiness: 12 }, cost: { money: 25, energy: 5 } }
      ]
    },
    {
      id: 'park',
      name: 'Парк',
      description: 'Зеленая зона для отдыха и прогулок',
      icon: 'Trees',
      position: { x: 150, y: 100 },
      actions: [
        { id: 'walk', name: 'Прогулка', description: '+5 здоровье, +8 счастье', icon: 'Footprints', consequences: { health: 5, happiness: 8 }, cost: { energy: 8 } },
        { id: 'jog', name: 'Пробежка', description: '+8 здоровье', icon: 'Activity', consequences: { health: 8 }, cost: { energy: 15 } },
        { id: 'picnic', name: 'Пикник', description: '+15 счастье', icon: 'Coffee', consequences: { happiness: 15 }, cost: { money: 40, energy: 10 } }
      ]
    },
    {
      id: 'cafe',
      name: 'Кафе',
      description: 'Уютное место для встреч с друзьями',
      icon: 'Coffee',
      position: { x: 400, y: 250 },
      actions: [
        { id: 'meet_friends', name: 'Встреча с друзьями', description: '+15 счастье', icon: 'Users', consequences: { happiness: 15 }, cost: { money: 60, energy: 5 } },
        { id: 'work_laptop', name: 'Работа за ноутбуком', description: '+$100', icon: 'Laptop', consequences: { money: 100 }, cost: { energy: 8 } },
        { id: 'date', name: 'Свидание', description: '+20 счастье', icon: 'Heart', consequences: { happiness: 20 }, cost: { money: 120, energy: 10 } }
      ]
    }
  ];

  const lifeEvents: LifeEvent[] = [
    {
      id: '1',
      title: 'Неожиданное предложение работы',
      description: 'Вам поступило предложение о работе в крупной IT-компании с зарплатой в 2 раза выше текущей, но потребуется переезд в другой город.',
      choices: [
        { text: 'Принять предложение', consequences: { money: 1000, happiness: -10, energy: -20 } },
        { text: 'Отказаться и остаться', consequences: { happiness: 10, energy: 5 } }
      ]
    },
    {
      id: '2',
      title: 'Встреча со старым другом',
      description: 'Случайно встретили старого школьного друга, который предлагает вместе открыть бизнес.',
      choices: [
        { text: 'Инвестировать деньги', consequences: { money: -500, happiness: 15 } },
        { text: 'Вежливо отказаться', consequences: { happiness: -5 } }
      ]
    },
    {
      id: '3',
      title: 'Проблемы со здоровьем',
      description: 'На плановом медосмотре врач рекомендует больше заниматься спортом и правильно питаться.',
      choices: [
        { text: 'Записаться в спортзал', consequences: { health: 15, money: -200, energy: -10 } },
        { text: 'Игнорировать совет', consequences: { health: -5, happiness: 5 } }
      ]
    }
  ];

  const triggerRandomEvent = () => {
    const randomEvent = lifeEvents[Math.floor(Math.random() * lifeEvents.length)];
    setCurrentEvent(randomEvent);
    setShowEventModal(true);
  };

  const handleChoice = (choice: LifeEvent['choices'][0]) => {
    setGameStats(prev => ({
      ...prev,
      health: Math.max(0, Math.min(100, prev.health + (choice.consequences.health || 0))),
      energy: Math.max(0, Math.min(100, prev.energy + (choice.consequences.energy || 0))),
      money: Math.max(0, prev.money + (choice.consequences.money || 0)),
      happiness: Math.max(0, Math.min(100, prev.happiness + (choice.consequences.happiness || 0)))
    }));
    setShowEventModal(false);
    setCurrentEvent(null);
  };

  const handleLocationAction = (action: LocationAction) => {
    // Проверяем, хватает ли ресурсов
    if (action.cost?.energy && gameStats.energy < action.cost.energy) {
      alert('Недостаточно энергии!');
      return;
    }
    if (action.cost?.money && gameStats.money < action.cost.money) {
      alert('Недостаточно денег!');
      return;
    }

    // Применяем изменения
    setGameStats(prev => ({
      ...prev,
      health: Math.max(0, Math.min(100, prev.health + (action.consequences.health || 0))),
      energy: Math.max(0, Math.min(100, prev.energy + (action.consequences.energy || 0) - (action.cost?.energy || 0))),
      money: Math.max(0, prev.money + (action.consequences.money || 0) - (action.cost?.money || 0)),
      happiness: Math.max(0, Math.min(100, prev.happiness + (action.consequences.happiness || 0)))
    }));
  };

  const moveToLocation = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location && gameStats.energy >= 5) {
      setCurrentLocation(locationId);
      setPlayerPosition(location.position);
      setGameStats(prev => ({ ...prev, energy: Math.max(0, prev.energy - 5) }));
    } else if (gameStats.energy < 5) {
      alert('Недостаточно энергии для перемещения!');
    }
  };

  const getCurrentLocation = () => {
    return locations.find(loc => loc.id === currentLocation) || locations[0];
  };

  useEffect(() => {
    const eventTimer = setInterval(() => {
      if (Math.random() < 0.3 && !showEventModal) { // 30% шанс события каждые 10 секунд
        triggerRandomEvent();
      }
    }, 10000);

    return () => clearInterval(eventTimer);
  }, [showEventModal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">REAL LIFE GAME</h1>
          <p className="text-slate-600">Симулятор реальной жизни с выборами и последствиями</p>
        </div>

        {/* Player Stats */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="User" size={24} />
              Персонаж - Уровень {gameStats.level}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Heart" size={16} className="text-red-500" />
                  <span className="text-sm font-medium">Здоровье</span>
                </div>
                <Progress value={gameStats.health} className="h-2" />
                <span className="text-xs text-slate-600">{gameStats.health}/100</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Zap" size={16} className="text-yellow-500" />
                  <span className="text-sm font-medium">Энергия</span>
                </div>
                <Progress value={gameStats.energy} className="h-2" />
                <span className="text-xs text-slate-600">{gameStats.energy}/100</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="DollarSign" size={16} className="text-green-500" />
                  <span className="text-sm font-medium">Деньги</span>
                </div>
                <span className="text-lg font-bold text-green-600">${gameStats.money}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Smile" size={16} className="text-blue-500" />
                  <span className="text-sm font-medium">Счастье</span>
                </div>
                <Progress value={gameStats.happiness} className="h-2" />
                <span className="text-xs text-slate-600">{gameStats.happiness}/100</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Calendar" size={16} className="text-purple-500" />
                  <span className="text-sm font-medium">Возраст</span>
                </div>
                <span className="text-lg font-bold">{gameStats.age} лет</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Game Interface */}
        <Tabs defaultValue="map" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Icon name="Map" size={16} />
              Карта
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <Icon name={getCurrentLocation().icon as any} size={16} />
              {getCurrentLocation().name}
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Icon name="Package" size={16} />
              Инвентарь
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Icon name="Trophy" size={16} />
              Достижения
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <Icon name="ShoppingCart" size={16} />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="characters" className="flex items-center gap-2">
              <Icon name="Users" size={16} />
              Персонажи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Map" size={24} />
                  Карта города
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 h-96 overflow-hidden">
                  {/* Игровая карта */}
                  <svg className="w-full h-full" viewBox="0 0 500 400">
                    {/* Дороги */}
                    <path d="M0 200 L500 200" stroke="#94a3b8" strokeWidth="4" fill="none" />
                    <path d="M250 0 L250 400" stroke="#94a3b8" strokeWidth="4" fill="none" />
                    <path d="M150 100 L400 250" stroke="#94a3b8" strokeWidth="3" fill="none" />
                    <path d="M350 150 L350 320" stroke="#94a3b8" strokeWidth="3" fill="none" />
                    
                    {/* Локации */}
                    {locations.map((location) => (
                      <g key={location.id}>
                        <circle
                          cx={location.position.x}
                          cy={location.position.y}
                          r="20"
                          fill={currentLocation === location.id ? '#3b82f6' : '#e2e8f0'}
                          stroke={currentLocation === location.id ? '#1d4ed8' : '#94a3b8'}
                          strokeWidth="2"
                          className="cursor-pointer hover:fill-blue-200 transition-colors"
                          onClick={() => moveToLocation(location.id)}
                        />
                        <text
                          x={location.position.x}
                          y={location.position.y + 35}
                          textAnchor="middle"
                          className="text-xs font-medium fill-slate-700 cursor-pointer"
                          onClick={() => moveToLocation(location.id)}
                        >
                          {location.name}
                        </text>
                      </g>
                    ))}
                    
                    {/* Игрок */}
                    <circle
                      cx={playerPosition.x}
                      cy={playerPosition.y}
                      r="8"
                      fill="#ef4444"
                      stroke="#dc2626"
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                  </svg>
                  
                  <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 text-sm">
                    <p className="font-medium">💡 Подсказка:</p>
                    <p>Нажмите на локацию, чтобы переместиться туда (-5 энергии)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name={getCurrentLocation().icon as any} size={24} />
                  {getCurrentLocation().name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">{getCurrentLocation().description}</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getCurrentLocation().actions.map((action) => (
                    <Card key={action.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon name={action.icon as any} size={24} className="text-blue-600" />
                        <div className="flex-1">
                          <h4 className="font-medium">{action.name}</h4>
                          <p className="text-sm text-slate-600">{action.description}</p>
                        </div>
                      </div>
                      {(action.cost?.energy || action.cost?.money) && (
                        <div className="text-xs text-slate-500 mb-2">
                          Стоимость: {action.cost.energy && `${action.cost.energy} энергии`} {action.cost.money && `$${action.cost.money}`}
                        </div>
                      )}
                      <Button 
                        onClick={() => handleLocationAction(action)}
                        className="w-full"
                        disabled={(
                          (action.cost?.energy && gameStats.energy < action.cost.energy) ||
                          (action.cost?.money && gameStats.money < action.cost.money)
                        )}
                      >
                        Выполнить
                      </Button>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <Button onClick={triggerRandomEvent} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Icon name="Shuffle" size={16} className="mr-2" />
                    Случайное событие
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Инвентарь</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventory.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <Icon name={item.icon as any} size={24} className="text-blue-600" />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-slate-600">{item.type}</p>
                          {item.value > 0 && (
                            <p className="text-sm font-medium text-green-600">${item.value}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Достижения</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className={`p-4 ${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <Icon name={achievement.icon as any} size={24} className={achievement.unlocked ? 'text-green-600' : 'text-slate-400'} />
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-slate-600">{achievement.description}</p>
                        </div>
                        {achievement.unlocked && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Выполнено
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shop">
            <Card>
              <CardHeader>
                <CardTitle>Магазин</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Icon name="Coffee" size={24} className="text-brown-600" />
                      <div className="flex-1">
                        <h4 className="font-medium">Кофе</h4>
                        <p className="text-sm text-slate-600">+10 энергии</p>
                        <p className="text-sm font-medium text-green-600">$5</p>
                      </div>
                      <Button size="sm">Купить</Button>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Icon name="Shirt" size={24} className="text-blue-600" />
                      <div className="flex-1">
                        <h4 className="font-medium">Новая одежда</h4>
                        <p className="text-sm text-slate-600">+5 счастье</p>
                        <p className="text-sm font-medium text-green-600">$150</p>
                      </div>
                      <Button size="sm">Купить</Button>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Icon name="Book" size={24} className="text-purple-600" />
                      <div className="flex-1">
                        <h4 className="font-medium">Книга</h4>
                        <p className="text-sm text-slate-600">+3 уровень</p>
                        <p className="text-sm font-medium text-green-600">$25</p>
                      </div>
                      <Button size="sm">Купить</Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="characters">
            <Card>
              <CardHeader>
                <CardTitle>Персонажи</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Icon name="User" size={24} className="text-blue-600" />
                      <div className="flex-1">
                        <h4 className="font-medium">Анна</h4>
                        <p className="text-sm text-slate-600">Лучшая подруга</p>
                        <Badge variant="secondary">Дружба: 85%</Badge>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Icon name="User" size={24} className="text-green-600" />
                      <div className="flex-1">
                        <h4 className="font-medium">Михаил</h4>
                        <p className="text-sm text-slate-600">Коллега по работе</p>
                        <Badge variant="secondary">Знакомство: 45%</Badge>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Icon name="User" size={24} className="text-purple-600" />
                      <div className="flex-1">
                        <h4 className="font-medium">Елена</h4>
                        <p className="text-sm text-slate-600">Соседка</p>
                        <Badge variant="secondary">Знакомство: 20%</Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Event Modal */}
        {showEventModal && currentEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="AlertCircle" size={24} className="text-orange-500" />
                  {currentEvent.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">{currentEvent.description}</p>
                <div className="space-y-2">
                  {currentEvent.choices.map((choice, index) => (
                    <Button 
                      key={index}
                      onClick={() => handleChoice(choice)}
                      className="w-full justify-start"
                      variant={index === 0 ? "default" : "outline"}
                    >
                      {choice.text}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealLifeGame;