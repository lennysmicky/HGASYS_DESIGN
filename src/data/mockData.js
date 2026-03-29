// ========== UTILISATEURS (comptes de connexion) ==========
export const mockUsers = [
  {
    id: 1,
    name: 'Ahmed Benali',
    email: 'admin@hgasys.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'actif',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Fatima Zahra',
    email: 'manager@hgasys.com',
    password: 'manager123',
    role: 'manager',
    avatar: 'https://fatimakadiri.com/wp-content/uploads/2026/01/Untitled-design-10.png',
    status: 'actif',
    createdAt: '2024-02-10'
  },
  {
    id: 3,
    name: 'Karim Mansouri',
    email: 'vendeur@hgasys.com',
    password: 'vendeur123',
    role: 'employe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    status: 'actif',
    createdAt: '2024-03-05'
  },
  {
    id: 4,
    name: 'Sara Boudiaf',
    email: 'sara@hgasys.com',
    password: 'sara123',
    role: 'employe',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    status: 'actif',
    createdAt: '2024-03-20'
  }
];

// ========== EMPLOYÉS (dossiers RH) ==========
export const mockEmployees = [
  {
    id: 1,
    name: 'Ahmed Benali',
    poste: 'Directeur Général',
    departement: 'Direction',
    salaire: 180000,
    telephone: '0555 12 34 56',
    email: 'ahmed@hgasys.com',
    adresse: '12 Rue Didouche Mourad, Alger',
    dateEmbauche: '2020-01-15',
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    documents: [
      { name: 'Contrat CDI', type: 'PDF', date: '2020-01-15', size: '245 KB' },
      { name: 'CV', type: 'PDF', date: '2019-12-20', size: '180 KB' },
      { name: 'Diplôme', type: 'PDF', date: '2015-06-30', size: '320 KB' }
    ]
  },
  {
    id: 2,
    name: 'Fatima Zahra',
    poste: 'Responsable Commercial',
    departement: 'Commercial',
    salaire: 120000,
    telephone: '0555 23 45 67',
    email: 'fatima@hgasys.com',
    adresse: '45 Boulevard Mohamed V, Oran',
    dateEmbauche: '2021-03-10',
    status: 'actif',
    photo: 'https://fatimakadiri.com/wp-content/uploads/2026/01/Untitled-design-10.png',
    documents: [
      { name: 'Contrat CDI', type: 'PDF', date: '2021-03-10', size: '250 KB' },
      { name: 'CV', type: 'PDF', date: '2021-02-28', size: '195 KB' }
    ]
  },
  {
    id: 3,
    name: 'Karim Mansouri',
    poste: 'Vendeur Senior',
    departement: 'Ventes',
    salaire: 85000,
    telephone: '0555 34 56 78',
    email: 'karim@hgasys.com',
    adresse: '78 Rue Larbi Ben Mhidi, Constantine',
    dateEmbauche: '2022-06-01',
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    documents: [
      { name: 'Contrat CDD', type: 'PDF', date: '2022-06-01', size: '230 KB' },
      { name: 'CV', type: 'PDF', date: '2022-05-15', size: '170 KB' },
      { name: 'Attestation Formation', type: 'PDF', date: '2023-01-20', size: '150 KB' }
    ]
  },
  {
    id: 4,
    name: 'Sara Boudiaf',
    poste: 'Vendeuse',
    departement: 'Ventes',
    salaire: 65000,
    telephone: '0555 45 67 89',
    email: 'sara@hgasys.com',
    adresse: '23 Cité des Oliviers, Blida',
    dateEmbauche: '2023-09-15',
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    documents: [
      { name: 'Contrat CDD', type: 'PDF', date: '2023-09-15', size: '240 KB' },
      { name: 'CV', type: 'PDF', date: '2023-09-01', size: '160 KB' }
    ]
  },
  {
    id: 5,
    name: 'Youcef Hamidi',
    poste: 'Mécanicien Chef',
    departement: 'Atelier',
    salaire: 95000,
    telephone: '0555 56 78 90',
    email: 'youcef@hgasys.com',
    adresse: '56 Rue des Frères Bouadou, Tizi Ouzou',
    dateEmbauche: '2021-08-20',
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    documents: [
      { name: 'Contrat CDI', type: 'PDF', date: '2021-08-20', size: '255 KB' },
      { name: 'Certificat Mécanique', type: 'PDF', date: '2018-07-10', size: '290 KB' }
    ]
  },
  {
    id: 6,
    name: 'Amina Khelifi',
    poste: 'Comptable',
    departement: 'Finance',
    salaire: 90000,
    telephone: '0555 67 89 01',
    email: 'amina@hgasys.com',
    adresse: '89 Avenue de l\'ALN, Sétif',
    dateEmbauche: '2022-01-10',
    status: 'inactif',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    documents: [
      { name: 'Contrat CDI', type: 'PDF', date: '2022-01-10', size: '248 KB' }
    ]
  }
];

// ========== VÉHICULES ==========
export const mockVehicles = [
  {
    id: 1,
    marque: 'Toyota',
    modele: 'Corolla',
    annee: 2024,
    prix: 3200000,
    couleur: 'Blanc',
    kilometrage: 0,
    carburant: 'Essence',
    transmission: 'Automatique',
    statut: 'disponible',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop',
    description: 'Toyota Corolla neuve, full options'
  },
  {
    id: 2,
    marque: 'Hyundai',
    modele: 'Tucson',
    annee: 2024,
    prix: 4500000,
    couleur: 'Noir',
    kilometrage: 0,
    carburant: 'Diesel',
    transmission: 'Automatique',
    statut: 'disponible',
    image: 'https://assets.motorpoint.co.uk/images/content/HyundaiTucsonNLine(3).jpg',
    description: 'Hyundai Tucson dernière génération'
  },
  {
    id: 3,
    marque: 'Volkswagen',
    modele: 'Golf 8',
    annee: 2023,
    prix: 3800000,
    couleur: 'Gris',
    kilometrage: 15000,
    carburant: 'Diesel',
    transmission: 'Manuelle',
    statut: 'disponible',
    image: 'https://www.auto-infos.fr/mediatheque/4/1/5/000179514_1200x800_c.jpg',
    description: 'Golf 8 en excellent état'
  },
  {
    id: 4,
    marque: 'Mercedes',
    modele: 'Classe C',
    annee: 2023,
    prix: 7500000,
    couleur: 'Noir',
    kilometrage: 8000,
    carburant: 'Diesel',
    transmission: 'Automatique',
    statut: 'vendu',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop',
    description: 'Mercedes Classe C AMG Line'
  },
  {
    id: 5,
    marque: 'BMW',
    modele: 'Série 3',
    annee: 2024,
    prix: 6800000,
    couleur: 'Bleu',
    kilometrage: 0,
    carburant: 'Essence',
    transmission: 'Automatique',
    statut: 'disponible',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop',
    description: 'BMW Série 3 Sport neuve'
  },
  {
    id: 6,
    marque: 'Peugeot',
    modele: '3008',
    annee: 2023,
    prix: 4200000,
    couleur: 'Blanc',
    kilometrage: 20000,
    carburant: 'Diesel',
    transmission: 'Automatique',
    statut: 'vendu',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=250&fit=crop',
    description: 'Peugeot 3008 GT Line'
  },
  {
    id: 7,
    marque: 'Audi',
    modele: 'A4',
    annee: 2024,
    prix: 7200000,
    couleur: 'Gris',
    kilometrage: 0,
    carburant: 'Essence',
    transmission: 'Automatique',
    statut: 'disponible',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop',
    description: 'Audi A4 S-Line neuve'
  },
  {
    id: 8,
    marque: 'Renault',
    modele: 'Clio 5',
    annee: 2023,
    prix: 2800000,
    couleur: 'Rouge',
    kilometrage: 5000,
    carburant: 'Essence',
    transmission: 'Manuelle',
    statut: 'disponible',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=250&fit=crop',
    description: 'Renault Clio 5 comme neuve'
  }
];

// ========== CLIENTS ==========
export const mockClients = [
  {
    id: 1,
    name: 'Mohamed Cherif',
    telephone: '0555 11 22 33',
    email: 'mohamed.cherif@gmail.com',
    adresse: 'Alger Centre',
    type: 'Particulier',
    createdAt: '2024-01-20',
    achats: [4]
  },
  {
    id: 2,
    name: 'Entreprise SONATRACH',
    telephone: '021 54 67 89',
    email: 'contact@sonatrach.dz',
    adresse: 'Hydra, Alger',
    type: 'Entreprise',
    createdAt: '2024-02-15',
    achats: [6]
  },
  {
    id: 3,
    name: 'Rachid Bouzid',
    telephone: '0555 44 55 66',
    email: 'rachid.b@gmail.com',
    adresse: 'Oran',
    type: 'Particulier',
    createdAt: '2024-03-10',
    achats: []
  },
  {
    id: 4,
    name: 'Nadia Ferhat',
    telephone: '0555 77 88 99',
    email: 'nadia.f@yahoo.fr',
    adresse: 'Constantine',
    type: 'Particulier',
    createdAt: '2024-04-05',
    achats: []
  },
  {
    id: 5,
    name: 'Entreprise CEVITAL',
    telephone: '034 22 33 44',
    email: 'fleet@cevital.com',
    adresse: 'Béjaïa',
    type: 'Entreprise',
    createdAt: '2024-01-30',
    achats: []
  }
];

// ========== VENTES ==========
export const mockSales = [
  {
    id: 1,
    clientId: 1,
    clientName: 'Mohamed Cherif',
    vehicleId: 4,
    vehicleName: 'Mercedes Classe C 2023',
    vendeurId: 3,
    vendeurName: 'Karim Mansouri',
    montant: 7500000,
    date: '2024-06-15',
    statut: 'completee',
    paiement: {
      methode: 'Virement',
      statut: 'payé',
      montantPaye: 7500000,
      reste: 0
    }
  },
  {
    id: 2,
    clientId: 2,
    clientName: 'Entreprise SONATRACH',
    vehicleId: 6,
    vehicleName: 'Peugeot 3008 2023',
    vendeurId: 2,
    vendeurName: 'Fatima Zahra',
    montant: 4200000,
    date: '2024-07-20',
    statut: 'completee',
    paiement: {
      methode: 'Chèque',
      statut: 'payé',
      montantPaye: 4200000,
      reste: 0
    }
  },
  {
    id: 3,
    clientId: 3,
    clientName: 'Rachid Bouzid',
    vehicleId: 1,
    vehicleName: 'Toyota Corolla 2024',
    vendeurId: 4,
    vendeurName: 'Sara Boudiaf',
    montant: 3200000,
    date: '2024-08-10',
    statut: 'en_cours',
    paiement: {
      methode: 'Crédit',
      statut: 'en attente',
      montantPaye: 1600000,
      reste: 1600000
    }
  },
  {
    id: 4,
    clientId: 4,
    clientName: 'Nadia Ferhat',
    vehicleId: 5,
    vehicleName: 'BMW Série 3 2024',
    vendeurId: 3,
    vendeurName: 'Karim Mansouri',
    montant: 6800000,
    date: '2024-09-01',
    statut: 'en_cours',
    paiement: {
      methode: 'Virement',
      statut: 'en attente',
      montantPaye: 3400000,
      reste: 3400000
    }
  }
];

// ========== NOTIFICATIONS ==========
export const mockNotifications = [
  { id: 1, message: 'Nouvelle vente : Mercedes Classe C', type: 'vente', date: '2024-06-15', lu: true },
  { id: 2, message: 'Nouveau client : Rachid Bouzid', type: 'client', date: '2024-03-10', lu: true },
  { id: 3, message: 'Paiement reçu : 1 600 000 CFA', type: 'paiement', date: '2024-08-10', lu: false },
  { id: 4, message: 'Nouveau véhicule ajouté : Audi A4', type: 'vehicule', date: '2024-08-25', lu: false },
  { id: 5, message: 'Vente en cours : BMW Série 3', type: 'vente', date: '2024-09-01', lu: false },
];

// ========== STATS DASHBOARD ==========
export const mockStats = {
  totalVehicules: 8,
  vehiculesDisponibles: 6,
  vehiculesVendus: 2,
  totalClients: 5,
  totalVentes: 4,
  ventesEnCours: 2,
  revenus: 21700000,
  employesActifs: 5,
  ventesParMois: [
    { mois: 'Jan', ventes: 2, revenus: 5400000 },
    { mois: 'Fév', ventes: 1, revenus: 3200000 },
    { mois: 'Mar', ventes: 3, revenus: 9800000 },
    { mois: 'Avr', ventes: 2, revenus: 6500000 },
    { mois: 'Mai', ventes: 4, revenus: 15200000 },
    { mois: 'Jun', ventes: 3, revenus: 11700000 },
    { mois: 'Jul', ventes: 2, revenus: 8400000 },
    { mois: 'Aoû', ventes: 5, revenus: 21700000 },
    { mois: 'Sep', ventes: 3, revenus: 13500000 },
    { mois: 'Oct', ventes: 0, revenus: 0 },
    { mois: 'Nov', ventes: 0, revenus: 0 },
    { mois: 'Déc', ventes: 0, revenus: 0 },
  ],
  ventesParMarque: [
    { marque: 'Toyota', ventes: 5 },
    { marque: 'Mercedes', ventes: 3 },
    { marque: 'BMW', ventes: 4 },
    { marque: 'Peugeot', ventes: 2 },
    { marque: 'Hyundai', ventes: 3 },
    { marque: 'Volkswagen', ventes: 2 },
  ]
};