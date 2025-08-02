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

  const handleDailyAction = (action: string) => {
    switch (action) {
      case 'work':
        setGameStats(prev => ({ ...prev, money: prev.money + 200, energy: Math.max(0, prev.energy - 10) }));
        break;
      case 'gym':
        setGameStats(prev => ({ ...prev, health: Math.min(100, prev.health + 5), energy: Math.max(0, prev.energy - 15) }));
        break;
      case 'friends':
        setGameStats(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 10) }));
        break;
      case 'rest':
        setGameStats(prev => ({ ...prev, energy: Math.min(100, prev.energy + 30) }));
        break;
      case 'cook':
        setGameStats(prev => ({ ...prev, health: Math.min(100, prev.health + 3), money: prev.money - 20 }));
        break;
    }
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
        <Tabs defaultValue="home" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Icon name="Home" size={16} />
              Дом
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

          <TabsContent value="home" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ваш дом</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <Icon name="Home" size={48} className="text-slate-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start" onClick={() => handleDailyAction('rest')}>
                        <Icon name="Bed" size={16} className="mr-2" />
                        Отдохнуть
                      </Button>
                      <Button variant="outline" className="justify-start" onClick={() => handleDailyAction('cook')}>
                        <Icon name="ChefHat" size={16} className="mr-2" />
                        Приготовить еду
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ежедневные действия</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button onClick={triggerRandomEvent} className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                      <Icon name="Shuffle" size={16} className="mr-2" />
                      Случайное событие
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleDailyAction('work')}>
                      <Icon name="Briefcase" size={16} className="mr-2" />
                      Идти на работу (+$200, -10 энергии)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleDailyAction('gym')}>
                      <Icon name="Dumbbell" size={16} className="mr-2" />
                      Спортзал (+5 здоровье, -15 энергия)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleDailyAction('friends')}>
                      <Icon name="Users" size={16} className="mr-2" />
                      Встреча с друзьями (+10 счастье)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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