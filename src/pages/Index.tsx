import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface GameElement {
  id: string;
  type: 'character' | 'item' | 'location' | 'action';
  name: string;
  description: string;
  icon: string;
  properties: {
    [key: string]: any;
  };
  position?: { x: number; y: number };
}

interface GameProject {
  id: string;
  name: string;
  description: string;
  elements: GameElement[];
  gameLogic: string;
  lastModified: Date;
}

const GameEditor = () => {
  const [projects, setProjects] = useState<GameProject[]>([]);
  const [currentProject, setCurrentProject] = useState<GameProject | null>(null);
  const [selectedElement, setSelectedElement] = useState<GameElement | null>(null);
  const [showElementModal, setShowElementModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Создание нового проекта
  const createNewProject = (name: string, description: string) => {
    const newProject: GameProject = {
      id: Date.now().toString(),
      name,
      description,
      elements: [],
      gameLogic: '',
      lastModified: new Date()
    };
    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    setShowProjectModal(false);
  };

  // Добавление элемента
  const addElement = (element: Omit<GameElement, 'id'>) => {
    if (!currentProject) return;
    
    const newElement: GameElement = {
      ...element,
      id: Date.now().toString()
    };
    
    const updatedProject = {
      ...currentProject,
      elements: [...currentProject.elements, newElement],
      lastModified: new Date()
    };
    
    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
    setShowElementModal(false);
  };

  // Удаление элемента
  const deleteElement = (elementId: string) => {
    if (!currentProject) return;
    
    const updatedProject = {
      ...currentProject,
      elements: currentProject.elements.filter(e => e.id !== elementId),
      lastModified: new Date()
    };
    
    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
  };

  // Обновление элемента
  const updateElement = (updatedElement: GameElement) => {
    if (!currentProject) return;
    
    const updatedProject = {
      ...currentProject,
      elements: currentProject.elements.map(e => e.id === updatedElement.id ? updatedElement : e),
      lastModified: new Date()
    };
    
    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
  };

  // Шаблоны элементов
  const elementTemplates = {
    character: {
      type: 'character' as const,
      name: 'Новый персонаж',
      description: 'Описание персонажа',
      icon: 'User',
      properties: {
        health: 100,
        strength: 10,
        dialogue: 'Привет! Как дела?'
      }
    },
    item: {
      type: 'item' as const,
      name: 'Новый предмет',
      description: 'Описание предмета',
      icon: 'Package',
      properties: {
        value: 100,
        rarity: 'common',
        effect: 'none'
      }
    },
    location: {
      type: 'location' as const,
      name: 'Новая локация',
      description: 'Описание локации',
      icon: 'MapPin',
      properties: {
        background: 'forest',
        music: 'ambient',
        connections: []
      },
      position: { x: 100, y: 100 }
    },
    action: {
      type: 'action' as const,
      name: 'Новое действие',
      description: 'Описание действия',
      icon: 'Zap',
      properties: {
        cost: 10,
        effect: 'heal',
        value: 20
      }
    }
  };

  // Рендер игрового проекта
  const renderGamePreview = () => {
    if (!currentProject || !isPlaying) return null;

    const locations = currentProject.elements.filter(e => e.type === 'location');
    const characters = currentProject.elements.filter(e => e.type === 'character');
    const items = currentProject.elements.filter(e => e.type === 'item');

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Игра: {currentProject.name}</h3>
          <Button onClick={() => setIsPlaying(false)} variant="outline">
            <Icon name="Edit" size={16} className="mr-2" />
            Редактировать
          </Button>
        </div>
        
        {/* Игровая карта */}
        <Card>
          <CardHeader>
            <CardTitle>Игровой мир</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 h-96 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 400">
                {locations.map((location) => (
                  <g key={location.id}>
                    <circle
                      cx={location.position?.x || 100}
                      cy={location.position?.y || 100}
                      r="30"
                      fill="#3b82f6"
                      stroke="#1d4ed8"
                      strokeWidth="2"
                      className="cursor-pointer hover:fill-blue-600 transition-colors"
                    />
                    <text
                      x={location.position?.x || 100}
                      y={(location.position?.y || 100) + 45}
                      textAnchor="middle"
                      className="text-xs font-medium fill-slate-700"
                    >
                      {location.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Персонажи */}
        {characters.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Персонажи</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characters.map((character) => (
                  <Card key={character.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <Icon name={character.icon as any} size={24} className="text-blue-600" />
                      <div className="flex-1">
                        <h4 className="font-medium">{character.name}</h4>
                        <p className="text-sm text-slate-600">{character.description}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          "{character.properties.dialogue}"
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Предметы */}
        {items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Предметы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex items-center gap-2">
                      <Icon name={item.icon as any} size={20} className="text-purple-600" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <p className="text-xs text-slate-600">{item.properties.rarity}</p>
                        <p className="text-xs text-green-600">{item.properties.value}₽</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">🎮 GAME STUDIO</h1>
          <p className="text-slate-600">Создавайте и редактируйте игры прямо в браузере</p>
        </div>

        {!currentProject && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="FolderOpen" size={24} />
                Мои проекты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {projects.map((project) => (
                  <Card key={project.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentProject(project)}>
                    <h3 className="font-semibold mb-2">{project.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{project.description}</p>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{project.elements.length} элементов</span>
                      <span>{new Date(project.lastModified).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))}
                
                <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
                  <DialogTrigger asChild>
                    <Card className="p-4 cursor-pointer border-dashed border-2 hover:bg-slate-50 transition-colors flex items-center justify-center">
                      <div className="text-center">
                        <Icon name="Plus" size={32} className="mx-auto mb-2 text-slate-400" />
                        <p className="text-sm text-slate-600">Создать новый проект</p>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новый проект</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      createNewProject(
                        formData.get('name') as string,
                        formData.get('description') as string
                      );
                    }}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Название проекта</Label>
                          <Input id="name" name="name" placeholder="Моя крутая игра" required />
                        </div>
                        <div>
                          <Label htmlFor="description">Описание</Label>
                          <Textarea id="description" name="description" placeholder="Описание игры..." />
                        </div>
                        <Button type="submit" className="w-full">Создать проект</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        {currentProject && (
          <div className="space-y-6">
            {/* Панель проекта */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Gamepad2" size={24} />
                      {currentProject.name}
                    </CardTitle>
                    <p className="text-slate-600 mt-1">{currentProject.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsPlaying(!isPlaying)} className={isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}>
                      <Icon name={isPlaying ? "Square" : "Play"} size={16} className="mr-2" />
                      {isPlaying ? "Стоп" : "Играть"}
                    </Button>
                    <Button onClick={() => setCurrentProject(null)} variant="outline">
                      <Icon name="ArrowLeft" size={16} className="mr-2" />
                      К проектам
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {isPlaying ? renderGamePreview() : (
              <Tabs defaultValue="elements" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="elements">Элементы</TabsTrigger>
                  <TabsTrigger value="map">Карта</TabsTrigger>
                  <TabsTrigger value="logic">Логика</TabsTrigger>
                  <TabsTrigger value="settings">Настройки</TabsTrigger>
                </TabsList>

                <TabsContent value="elements" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Элементы игры</h3>
                    <Dialog open={showElementModal} onOpenChange={setShowElementModal}>
                      <DialogTrigger asChild>
                        <Button>
                          <Icon name="Plus" size={16} className="mr-2" />
                          Добавить элемент
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Добавить элемент</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(elementTemplates).map(([type, template]) => (
                            <Button
                              key={type}
                              variant="outline"
                              className="h-auto p-4 flex flex-col gap-2"
                              onClick={() => {
                                addElement(template);
                              }}
                            >
                              <Icon name={template.icon as any} size={24} />
                              <span className="capitalize">{type === 'character' ? 'Персонаж' : type === 'item' ? 'Предмет' : type === 'location' ? 'Локация' : 'Действие'}</span>
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentProject.elements.map((element) => (
                      <Card key={element.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon name={element.icon as any} size={20} />
                            <Badge variant="outline">{element.type}</Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => setSelectedElement(element)}>
                              <Icon name="Edit" size={14} />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => deleteElement(element.id)}>
                              <Icon name="Trash" size={14} />
                            </Button>
                          </div>
                        </div>
                        <h4 className="font-medium">{element.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">{element.description}</p>
                        <div className="mt-2 text-xs text-slate-500">
                          {Object.entries(element.properties).slice(0, 2).map(([key, value]) => (
                            <div key={key}>{key}: {String(value)}</div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="map" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Редактор карты</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 h-96 overflow-hidden border-2 border-dashed">
                        <svg className="w-full h-full" viewBox="0 0 500 400">
                          {currentProject.elements
                            .filter(e => e.type === 'location' && e.position)
                            .map((location) => (
                              <g key={location.id}>
                                <circle
                                  cx={location.position!.x}
                                  cy={location.position!.y}
                                  r="25"
                                  fill="#3b82f6"
                                  stroke="#1d4ed8"
                                  strokeWidth="2"
                                  className="cursor-move"
                                />
                                <text
                                  x={location.position!.x}
                                  y={location.position!.y + 40}
                                  textAnchor="middle"
                                  className="text-xs font-medium fill-slate-700"
                                >
                                  {location.name}
                                </text>
                              </g>
                          ))}
                        </svg>
                        <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 text-sm">
                          <p className="font-medium">💡 Подсказка:</p>
                          <p>Перетаскивайте локации для изменения карты</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="logic" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Игровая логика</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Опишите логику игры... (например: 'Когда игрок говорит с персонажем X, показать диалог Y')"
                        value={currentProject.gameLogic}
                        onChange={(e) => {
                          const updatedProject = { ...currentProject, gameLogic: e.target.value };
                          setCurrentProject(updatedProject);
                          setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
                        }}
                        className="min-h-[200px]"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Настройки проекта</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label>Название игры</Label>
                          <Input 
                            value={currentProject.name}
                            onChange={(e) => {
                              const updatedProject = { ...currentProject, name: e.target.value };
                              setCurrentProject(updatedProject);
                              setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
                            }}
                          />
                        </div>
                        <div>
                          <Label>Описание</Label>
                          <Textarea 
                            value={currentProject.description}
                            onChange={(e) => {
                              const updatedProject = { ...currentProject, description: e.target.value };
                              setCurrentProject(updatedProject);
                              setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {/* Модальное окно редактирования элемента */}
            {selectedElement && (
              <Dialog open={!!selectedElement} onOpenChange={() => setSelectedElement(null)}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Редактировать элемент</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Название</Label>
                      <Input 
                        value={selectedElement.name}
                        onChange={(e) => setSelectedElement({...selectedElement, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Описание</Label>
                      <Textarea 
                        value={selectedElement.description}
                        onChange={(e) => setSelectedElement({...selectedElement, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Иконка</Label>
                      <Select value={selectedElement.icon} onValueChange={(value) => setSelectedElement({...selectedElement, icon: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="User">User</SelectItem>
                          <SelectItem value="Package">Package</SelectItem>
                          <SelectItem value="MapPin">MapPin</SelectItem>
                          <SelectItem value="Zap">Zap</SelectItem>
                          <SelectItem value="Heart">Heart</SelectItem>
                          <SelectItem value="Sword">Sword</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={() => {
                      updateElement(selectedElement);
                      setSelectedElement(null);
                    }} className="w-full">
                      Сохранить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameEditor;