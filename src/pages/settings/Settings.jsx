import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Settings as SettingsIcon,
    Business,
    Notifications,
    Language,
    Save,
    RestartAlt,
    CheckCircle,
    Phone,
    Email,
    LocationOn,
    Public,
    Receipt,
    Percent,
} from '@mui/icons-material';
import { mockSettings } from '../../data/mockData';
import '../../styles/settings.css';
import logo from '../../assets/images/logo.png';

const Settings = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getInitialTab = () => {
        if (location.pathname.includes('company')) return 1;
        if (location.pathname.includes('notifications')) return 2;
        return 0;
    };

    const [activeTab, setActiveTab] = useState(getInitialTab());
    const [saved, setSaved] = useState(false);

    // State pour chaque section
    const [systeme, setSysteme] = useState({ ...mockSettings.systeme });
    const [entreprise, setEntreprise] = useState({ ...mockSettings.entreprise });
    const [notifs, setNotifs] = useState({ ...mockSettings.notifications });

    const handleTabChange = (idx) => {
        setActiveTab(idx);
        setSaved(false);
        const paths = ['/settings/system', '/settings/company', '/settings/notifications'];
        navigate(paths[idx], { replace: true });
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleReset = () => {
        if (activeTab === 0) setSysteme({ ...mockSettings.systeme });
        if (activeTab === 1) setEntreprise({ ...mockSettings.entreprise });
        if (activeTab === 2) setNotifs({ ...mockSettings.notifications });
    };

    const handleSysChange = (field, value) => setSysteme((prev) => ({ ...prev, [field]: value }));
    const handleEntChange = (field, value) => setEntreprise((prev) => ({ ...prev, [field]: value }));
    const handleNotifChange = (field, value) => setNotifs((prev) => ({ ...prev, [field]: value }));

    return (
        <div className="set-page">
            {/* Header */}
            <div className="set-header">
                <div>
                    <h1 className="set-header-title">Paramètres</h1>
                    <p className="set-header-subtitle">Configuration du système, entreprise et notifications</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="set-tabs">
                <button onClick={() => handleTabChange(0)} className={`set-tab ${activeTab === 0 ? 'set-tab-active' : ''}`}>
                    <SettingsIcon sx={{ fontSize: 16 }} /> Système
                </button>
                <button onClick={() => handleTabChange(1)} className={`set-tab ${activeTab === 1 ? 'set-tab-active' : ''}`}>
                    <Business sx={{ fontSize: 16 }} /> Entreprise
                </button>
                <button onClick={() => handleTabChange(2)} className={`set-tab ${activeTab === 2 ? 'set-tab-active' : ''}`}>
                    <Notifications sx={{ fontSize: 16 }} /> Notifications
                </button>
            </div>

            {/* Success */}
            {saved && (
                <div className="set-success">
                    <CheckCircle sx={{ fontSize: 16 }} /> Paramètres sauvegardés avec succès
                </div>
            )}

            {/* ═══════ TAB 0 : SYSTÈME ═══════ */}
            {activeTab === 0 && (
                <div className="set-section">
                    <div className="set-section-header">
                        <div className="set-section-icon" style={{ background: '#eff6ff' }}>
                            <SettingsIcon sx={{ fontSize: 20, color: '#1976D2' }} />
                        </div>
                        <div>
                            <h2 className="set-section-title">Configuration système</h2>
                            <p className="set-section-desc">Langue, timezone, formats et options générales</p>
                        </div>
                    </div>
                    <div className="set-section-body">
                        <div className="set-form-grid">
                            <div className="set-field">
                                <label className="set-label">Langue</label>
                                <select value={systeme.langue} onChange={(e) => handleSysChange('langue', e.target.value)} className="set-select">
                                    <option value="fr">Français</option>
                                    <option value="en">English</option>
                                    <option value="ar">العربية</option>
                                </select>
                            </div>
                            <div className="set-field">
                                <label className="set-label">Fuseau horaire</label>
                                <select value={systeme.timezone} onChange={(e) => handleSysChange('timezone', e.target.value)} className="set-select">
                                    <option value="Africa/Algiers">Africa/Algiers (UTC+1)</option>
                                    <option value="Europe/Paris">Europe/Paris (UTC+1/+2)</option>
                                    <option value="Africa/Dakar">Africa/Dakar (UTC+0)</option>
                                </select>
                            </div>
                            <div className="set-field">
                                <label className="set-label">Format de date</label>
                                <select value={systeme.formatDate} onChange={(e) => handleSysChange('formatDate', e.target.value)} className="set-select">
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>
                            <div className="set-field">
                                <label className="set-label">Format monnaie</label>
                                <select value={systeme.formatMonnaie} onChange={(e) => handleSysChange('formatMonnaie', e.target.value)} className="set-select">
                                    <option value="#,##0 CFA">#,##0 CFA</option>
                                    <option value="#,##0 DA">#,##0 DA</option>
                                    <option value="#,##0 €">#,##0 €</option>
                                </select>
                            </div>
                            <div className="set-field">
                                <label className="set-label">Pagination par défaut</label>
                                <select value={systeme.paginationDefaut} onChange={(e) => handleSysChange('paginationDefaut', Number(e.target.value))} className="set-select">
                                    <option value={5}>5 éléments</option>
                                    <option value={10}>10 éléments</option>
                                    <option value={20}>20 éléments</option>
                                    <option value={50}>50 éléments</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <div className="set-toggle-row">
                                <div className="set-toggle-info">
                                    <p className="set-toggle-label">Sauvegarde automatique</p>
                                    <p className="set-toggle-desc">Sauvegarder automatiquement les modifications</p>
                                </div>
                                <label className="set-toggle">
                                    <input type="checkbox" checked={systeme.sauvegardeAuto} onChange={(e) => handleSysChange('sauvegardeAuto', e.target.checked)} />
                                    <span className="set-toggle-slider" />
                                </label>
                            </div>
                            <div className="set-toggle-row">
                                <div className="set-toggle-info">
                                    <p className="set-toggle-label">Mode debug</p>
                                    <p className="set-toggle-desc">Activer les logs de débogage (développement)</p>
                                </div>
                                <label className="set-toggle">
                                    <input type="checkbox" checked={systeme.modeDebug} onChange={(e) => handleSysChange('modeDebug', e.target.checked)} />
                                    <span className="set-toggle-slider" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════ TAB 1 : ENTREPRISE ═══════ */}
            {activeTab === 1 && (
                <>
                    <div className="set-section">
                        <div className="set-section-header">
                            <div className="set-section-icon" style={{ background: '#f3e8ff' }}>
                                <Business sx={{ fontSize: 20, color: '#7c3aed' }} />
                            </div>
                            <div>
                                <h2 className="set-section-title">Informations de l'entreprise</h2>
                                <p className="set-section-desc">Identité, coordonnées et informations fiscales</p>
                            </div>
                        </div>
                        <div className="set-section-body">
                            {/* Logo */}
                            <div className="set-logo-preview">
                                <div className="set-logo-img">
                                    <img src={logo} alt="Logo" className="set-logo-img" />
                                </div>
                                <div className="set-logo-info">
                                    <p className="set-logo-name">{entreprise.nom}</p>
                                    <p className="set-logo-hint">{entreprise.nomComplet}</p>
                                </div>
                            </div>

                            <div className="set-form-grid" style={{ marginTop: '1rem' }}>
                                <div className="set-field">
                                    <label className="set-label">Nom court</label>
                                    <input type="text" value={entreprise.nom} onChange={(e) => handleEntChange('nom', e.target.value)} className="set-input" />
                                </div>
                                <div className="set-field">
                                    <label className="set-label">Nom complet</label>
                                    <input type="text" value={entreprise.nomComplet} onChange={(e) => handleEntChange('nomComplet', e.target.value)} className="set-input" />
                                </div>
                                <div className="set-field set-form-full">
                                    <label className="set-label">Adresse</label>
                                    <input type="text" value={entreprise.adresse} onChange={(e) => handleEntChange('adresse', e.target.value)} className="set-input" />
                                </div>
                                <div className="set-field">
                                    <label className="set-label">Téléphone</label>
                                    <input type="text" value={entreprise.telephone} onChange={(e) => handleEntChange('telephone', e.target.value)} className="set-input" />
                                </div>
                                <div className="set-field">
                                    <label className="set-label">Email</label>
                                    <input type="email" value={entreprise.email} onChange={(e) => handleEntChange('email', e.target.value)} className="set-input" />
                                </div>
                                <div className="set-field">
                                    <label className="set-label">Site web</label>
                                    <input type="text" value={entreprise.siteWeb} onChange={(e) => handleEntChange('siteWeb', e.target.value)} className="set-input" />
                                </div>
                                <div className="set-field">
                                    <label className="set-label">Devise</label>
                                    <select value={entreprise.devise} onChange={(e) => handleEntChange('devise', e.target.value)} className="set-select">
                                        <option value="CFA">CFA</option>
                                        <option value="DA">DA (Dinar Algérien)</option>
                                        <option value="EUR">EUR (Euro)</option>
                                    </select>
                                </div>
                                <div className="set-field">
                                    <label className="set-label">TVA (%)</label>
                                    <input type="number" value={entreprise.tva} onChange={(e) => handleEntChange('tva', Number(e.target.value))} className="set-input" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fiscal info */}
                    <div className="set-section">
                        <div className="set-section-header">
                            <div className="set-section-icon" style={{ background: '#fff7ed' }}>
                                <Receipt sx={{ fontSize: 20, color: '#ea580c' }} />
                            </div>
                            <div>
                                <h2 className="set-section-title">Informations fiscales</h2>
                                <p className="set-section-desc">Registre de commerce, NIF, NIS</p>
                            </div>
                        </div>
                        <div className="set-section-body">
                            <div className="set-fiscal-grid">
                                <div className="set-field">
                                    <label className="set-label">N° Registre Commerce (NRC)</label>
                                    <input type="text" value={entreprise.nrc} onChange={(e) => handleEntChange('nrc', e.target.value)} className="set-input" />
                                </div>
                                <div className="set-field">
                                    <label className="set-label">N° Identification Fiscale (NIF)</label>
                                    <input type="text" value={entreprise.nif} onChange={(e) => handleEntChange('nif', e.target.value)} className="set-input" />
                                </div>
                                <div className="set-field">
                                    <label className="set-label">N° Identification Statistique (NIS)</label>
                                    <input type="text" value={entreprise.nis} onChange={(e) => handleEntChange('nis', e.target.value)} className="set-input" />
                                </div>
                            </div>

                            <div className="set-fiscal-grid" style={{ marginTop: '0.75rem' }}>
                                <div className="set-fiscal-item">
                                    <p className="set-fiscal-label">NRC</p>
                                    <p className="set-fiscal-value">{entreprise.nrc}</p>
                                </div>
                                <div className="set-fiscal-item">
                                    <p className="set-fiscal-label">NIF</p>
                                    <p className="set-fiscal-value">{entreprise.nif}</p>
                                </div>
                                <div className="set-fiscal-item">
                                    <p className="set-fiscal-label">NIS</p>
                                    <p className="set-fiscal-value">{entreprise.nis}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ═══════ TAB 2 : NOTIFICATIONS ═══════ */}
            {activeTab === 2 && (
                <div className="set-section">
                    <div className="set-section-header">
                        <div className="set-section-icon" style={{ background: '#f0fdf4' }}>
                            <Notifications sx={{ fontSize: 20, color: '#16a34a' }} />
                        </div>
                        <div>
                            <h2 className="set-section-title">Paramètres de notifications</h2>
                            <p className="set-section-desc">Alertes email, stock critique et rappels</p>
                        </div>
                    </div>
                    <div className="set-section-body">
                        {/* Email toggles */}
                        <div className="set-toggle-row">
                            <div className="set-toggle-info">
                                <p className="set-toggle-label">Notification vente par email</p>
                                <p className="set-toggle-desc">Recevoir un email à chaque nouvelle vente</p>
                            </div>
                            <label className="set-toggle">
                                <input type="checkbox" checked={notifs.emailVente} onChange={(e) => handleNotifChange('emailVente', e.target.checked)} />
                                <span className="set-toggle-slider" />
                            </label>
                        </div>

                        <div className="set-toggle-row">
                            <div className="set-toggle-info">
                                <p className="set-toggle-label">Alerte stock par email</p>
                                <p className="set-toggle-desc">Recevoir un email quand le stock atteint le seuil critique</p>
                            </div>
                            <label className="set-toggle">
                                <input type="checkbox" checked={notifs.emailStock} onChange={(e) => handleNotifChange('emailStock', e.target.checked)} />
                                <span className="set-toggle-slider" />
                            </label>
                        </div>

                        <div className="set-toggle-row">
                            <div className="set-toggle-info">
                                <p className="set-toggle-label">Notification ticket par email</p>
                                <p className="set-toggle-desc">Recevoir un email pour chaque nouveau ticket client</p>
                            </div>
                            <label className="set-toggle">
                                <input type="checkbox" checked={notifs.emailTicket} onChange={(e) => handleNotifChange('emailTicket', e.target.checked)} />
                                <span className="set-toggle-slider" />
                            </label>
                        </div>

                        <div className="set-toggle-row">
                            <div className="set-toggle-info">
                                <p className="set-toggle-label">Alerte stock critique</p>
                                <p className="set-toggle-desc">Afficher une alerte dans le dashboard pour les pièces en stock critique</p>
                            </div>
                            <label className="set-toggle">
                                <input type="checkbox" checked={notifs.alerteStockCritique} onChange={(e) => handleNotifChange('alerteStockCritique', e.target.checked)} />
                                <span className="set-toggle-slider" />
                            </label>
                        </div>

                        <div className="set-toggle-row">
                            <div className="set-toggle-info">
                                <p className="set-toggle-label">Rappel de révision</p>
                                <p className="set-toggle-desc">Notification avant chaque révision planifiée</p>
                            </div>
                            <label className="set-toggle">
                                <input type="checkbox" checked={notifs.rappelRevision} onChange={(e) => handleNotifChange('rappelRevision', e.target.checked)} />
                                <span className="set-toggle-slider" />
                            </label>
                        </div>

                        {/* Number settings */}
                        <div style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                            <div className="set-number-row">
                                <div className="set-toggle-info">
                                    <p className="set-toggle-label">Seuil stock critique</p>
                                    <p className="set-toggle-desc">Quantité minimale avant alerte</p>
                                </div>
                                <input
                                    type="number"
                                    value={notifs.seuilStockCritique}
                                    onChange={(e) => handleNotifChange('seuilStockCritique', Number(e.target.value))}
                                    className="set-number-input"
                                    min="1"
                                />
                            </div>

                            <div className="set-number-row">
                                <div className="set-toggle-info">
                                    <p className="set-toggle-label">Délai rappel révision</p>
                                    <p className="set-toggle-desc">Nombre de jours avant la révision pour le rappel</p>
                                </div>
                                <input
                                    type="number"
                                    value={notifs.delaiRappelRevision}
                                    onChange={(e) => handleNotifChange('delaiRappelRevision', Number(e.target.value))}
                                    className="set-number-input"
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Save bar */}
            <div className="set-save-bar">
                <button onClick={handleReset} className="set-reset-btn">
                    <RestartAlt sx={{ fontSize: 16 }} /> Réinitialiser
                </button>
                <button onClick={handleSave} className="set-save-btn">
                    <Save sx={{ fontSize: 16 }} /> Sauvegarder
                </button>
            </div>
        </div>
    );
};

export default Settings;