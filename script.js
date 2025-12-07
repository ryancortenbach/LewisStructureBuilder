// Lewis Structure Builder - Interactive Teaching Tool

class LewisStructureBuilder {
    constructor() {
        this.canvas = document.getElementById('lewis-canvas');
        this.ctx = this.canvas.getContext('2d');

        // State
        this.atoms = [];
        this.bonds = [];
        this.selectedTool = 'select';
        this.selectedElement = null;
        this.selectedBondType = 1;
        this.moleculeCharge = 0;
        this.bondingAtom = null;
        this.selectedAtom = null;
        this.draggingAtom = null;
        this.currentProblem = null;
        this.completedProblems = new Set();

        // Atom properties
        this.atomData = {
            H: { valence: 1, color: '#3b82f6', targetElectrons: 2 },
            C: { valence: 4, color: '#374151', targetElectrons: 8 },
            N: { valence: 5, color: '#2563eb', targetElectrons: 8 },
            O: { valence: 6, color: '#ef4444', targetElectrons: 8 },
            F: { valence: 7, color: '#22c55e', targetElectrons: 8 },
            Cl: { valence: 7, color: '#22c55e', targetElectrons: 8 },
            Br: { valence: 7, color: '#a855f7', targetElectrons: 8 },
            S: { valence: 6, color: '#eab308', targetElectrons: 8 },
            P: { valence: 5, color: '#f97316', targetElectrons: 8 }
        };

        // Problem definitions
        this.problems = {
            h2o: {
                name: 'Water',
                formula: 'H₂O',
                atoms: { H: 2, O: 1 },
                charge: 0,
                totalElectrons: 8,
                solution: {
                    bonds: [{ type: 1, between: ['H', 'O'] }, { type: 1, between: ['H', 'O'] }],
                    lonePairs: { O: 2 },
                    description: 'O is central with 2 single bonds to H and 2 lone pairs'
                },
                hints: [
                    'Oxygen should be the central atom',
                    'Each H-O bond uses 2 electrons',
                    'Oxygen needs 2 lone pairs to complete its octet'
                ]
            },
            nh3: {
                name: 'Ammonia',
                formula: 'NH₃',
                atoms: { N: 1, H: 3 },
                charge: 0,
                totalElectrons: 8,
                solution: {
                    bonds: [{ type: 1, between: ['N', 'H'] }, { type: 1, between: ['N', 'H'] }, { type: 1, between: ['N', 'H'] }],
                    lonePairs: { N: 1 },
                    description: 'N is central with 3 single bonds to H and 1 lone pair'
                },
                hints: [
                    'Nitrogen is the central atom',
                    'Nitrogen forms 3 bonds with hydrogen',
                    'Nitrogen has 1 lone pair'
                ]
            },
            ch4: {
                name: 'Methane',
                formula: 'CH₄',
                atoms: { C: 1, H: 4 },
                charge: 0,
                totalElectrons: 8,
                solution: {
                    bonds: [{ type: 1, between: ['C', 'H'] }, { type: 1, between: ['C', 'H'] }, { type: 1, between: ['C', 'H'] }, { type: 1, between: ['C', 'H'] }],
                    lonePairs: {},
                    description: 'C is central with 4 single bonds to H, no lone pairs'
                },
                hints: [
                    'Carbon is the central atom',
                    'Carbon forms 4 single bonds',
                    'No lone pairs are needed'
                ]
            },
            hcl: {
                name: 'Hydrogen Chloride',
                formula: 'HCl',
                atoms: { H: 1, Cl: 1 },
                charge: 0,
                totalElectrons: 8,
                solution: {
                    bonds: [{ type: 1, between: ['H', 'Cl'] }],
                    lonePairs: { Cl: 3 },
                    description: 'Single bond between H and Cl, 3 lone pairs on Cl'
                },
                hints: [
                    'Just one bond between H and Cl',
                    'Chlorine needs 3 lone pairs',
                    'Total of 8 electrons'
                ]
            },
            co2: {
                name: 'Carbon Dioxide',
                formula: 'CO₂',
                atoms: { C: 1, O: 2 },
                charge: 0,
                totalElectrons: 16,
                solution: {
                    bonds: [{ type: 2, between: ['C', 'O'] }, { type: 2, between: ['C', 'O'] }],
                    lonePairs: { O: 2 },
                    description: 'C is central with 2 double bonds to O, each O has 2 lone pairs'
                },
                hints: [
                    'Carbon is the central atom',
                    'You need double bonds for everyone to have an octet',
                    'Each oxygen has 2 lone pairs'
                ]
            },
            hcn: {
                name: 'Hydrogen Cyanide',
                formula: 'HCN',
                atoms: { H: 1, C: 1, N: 1 },
                charge: 0,
                totalElectrons: 10,
                solution: {
                    bonds: [{ type: 1, between: ['H', 'C'] }, { type: 3, between: ['C', 'N'] }],
                    lonePairs: { N: 1 },
                    description: 'H-C single bond, C≡N triple bond, 1 lone pair on N'
                },
                hints: [
                    'Carbon is the central atom',
                    'H connects to C with a single bond',
                    'C and N need a triple bond'
                ]
            },
            h2co: {
                name: 'Formaldehyde',
                formula: 'H₂CO',
                atoms: { H: 2, C: 1, O: 1 },
                charge: 0,
                totalElectrons: 12,
                solution: {
                    bonds: [{ type: 1, between: ['H', 'C'] }, { type: 1, between: ['H', 'C'] }, { type: 2, between: ['C', 'O'] }],
                    lonePairs: { O: 2 },
                    description: 'C is central, 2 single bonds to H, double bond to O, 2 lone pairs on O'
                },
                hints: [
                    'Carbon is the central atom',
                    'Both hydrogens bond to carbon',
                    'C=O double bond, oxygen has 2 lone pairs'
                ]
            },
            n2: {
                name: 'Nitrogen',
                formula: 'N₂',
                atoms: { N: 2 },
                charge: 0,
                totalElectrons: 10,
                solution: {
                    bonds: [{ type: 3, between: ['N', 'N'] }],
                    lonePairs: { N: 1 },
                    description: 'Triple bond between N atoms, 1 lone pair on each N'
                },
                hints: [
                    'The two nitrogen atoms share electrons',
                    'A triple bond is needed for both to have octets',
                    'Each N has 1 lone pair'
                ]
            },
            o3: {
                name: 'Ozone',
                formula: 'O₃',
                atoms: { O: 3 },
                charge: 0,
                totalElectrons: 18,
                solution: {
                    bonds: [{ type: 1, between: ['O', 'O'] }, { type: 2, between: ['O', 'O'] }],
                    lonePairs: { O: 'varies' },
                    description: 'Central O with one single and one double bond (resonance)'
                },
                hints: [
                    'One oxygen is central',
                    'One bond is single, one is double',
                    'This has resonance structures!'
                ]
            },
            no3: {
                name: 'Nitrate Ion',
                formula: 'NO₃⁻',
                atoms: { N: 1, O: 3 },
                charge: -1,
                totalElectrons: 24,
                solution: {
                    bonds: [{ type: 1, between: ['N', 'O'] }, { type: 1, between: ['N', 'O'] }, { type: 2, between: ['N', 'O'] }],
                    lonePairs: { O: 'varies' },
                    description: 'N central, resonance with double bond to one O at a time'
                },
                hints: [
                    'Nitrogen is central',
                    'The -1 charge adds one electron',
                    'Has resonance structures with the double bond'
                ]
            }
        };

        this.hintIndex = 0;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
        this.updateElectronCount();
        this.showTutorial();
    }

    setupEventListeners() {
        // Canvas events
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        // Atom buttons
        document.querySelectorAll('.atom-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectElement(btn));
        });

        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectTool(btn.dataset.tool));
        });

        // Bond type buttons
        document.querySelectorAll('.bond-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectBondType(parseInt(btn.dataset.bonds)));
        });

        // Charge buttons
        document.querySelectorAll('.charge-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectCharge(parseInt(btn.dataset.charge)));
        });

        // Problem buttons
        document.querySelectorAll('.problem-btn').forEach(btn => {
            btn.addEventListener('click', () => this.loadProblem(btn.dataset.problem));
        });

        // Action buttons
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
        document.getElementById('check-structure').addEventListener('click', () => this.checkStructure());
        document.getElementById('show-hint').addEventListener('click', () => this.showHint());
        document.getElementById('tutorial-btn').addEventListener('click', () => this.showTutorial());

        // Tutorial navigation
        document.getElementById('tutorial-prev').addEventListener('click', () => this.tutorialPrev());
        document.getElementById('tutorial-next').addEventListener('click', () => this.tutorialNext());

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModals();
            });
        });

        // Success modal buttons
        document.getElementById('next-problem').addEventListener('click', () => this.nextProblem());
        document.getElementById('close-success').addEventListener('click', () => this.closeModals());
    }

    selectElement(btn) {
        document.querySelectorAll('.atom-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedElement = btn.dataset.element;
        this.selectTool('select'); // Switch to select tool to place atom
    }

    selectTool(tool) {
        this.selectedTool = tool;
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });

        // Update cursor
        if (tool === 'delete') {
            this.canvas.style.cursor = 'not-allowed';
        } else if (tool === 'bond' || tool === 'lonepair') {
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'crosshair';
        }
    }

    selectBondType(type) {
        this.selectedBondType = type;
        document.querySelectorAll('.bond-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.bonds) === type);
        });
    }

    selectCharge(charge) {
        this.moleculeCharge = charge;
        document.querySelectorAll('.charge-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.charge) === charge);
        });
        this.updateElectronCount();
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Hide instructions after first interaction
        document.getElementById('canvas-instructions').classList.add('hidden');

        if (this.selectedTool === 'select' && this.selectedElement) {
            this.addAtom(x, y, this.selectedElement);
        } else if (this.selectedTool === 'bond') {
            this.handleBondClick(x, y);
        } else if (this.selectedTool === 'lonepair') {
            this.handleLonePairClick(x, y);
        } else if (this.selectedTool === 'delete') {
            this.handleDeleteClick(x, y);
        }
    }

    handleMouseDown(e) {
        if (this.selectedTool !== 'select') return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const atom = this.getAtomAt(x, y);
        if (atom) {
            this.draggingAtom = atom;
            this.canvas.style.cursor = 'grabbing';
        }
    }

    handleMouseMove(e) {
        if (!this.draggingAtom) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.draggingAtom.x = Math.max(30, Math.min(this.canvas.width - 30, x));
        this.draggingAtom.y = Math.max(30, Math.min(this.canvas.height - 30, y));
        this.render();
    }

    handleMouseUp(e) {
        this.draggingAtom = null;
        this.canvas.style.cursor = this.selectedTool === 'select' ? 'crosshair' : 'pointer';
    }

    addAtom(x, y, element) {
        const atom = {
            id: Date.now(),
            element,
            x,
            y,
            lonePairs: 0,
            ...this.atomData[element]
        };
        this.atoms.push(atom);
        this.selectedElement = null;
        document.querySelectorAll('.atom-btn').forEach(b => b.classList.remove('selected'));
        this.updateElectronCount();
        this.updateAtomStatus();
        this.render();
    }

    getAtomAt(x, y) {
        const radius = 25;
        return this.atoms.find(atom => {
            const dx = atom.x - x;
            const dy = atom.y - y;
            return Math.sqrt(dx * dx + dy * dy) < radius;
        });
    }

    handleBondClick(x, y) {
        const atom = this.getAtomAt(x, y);
        if (!atom) return;

        if (!this.bondingAtom) {
            this.bondingAtom = atom;
            this.selectedAtom = atom;
            this.render();
        } else if (this.bondingAtom.id !== atom.id) {
            // Check if bond already exists
            const existingBond = this.bonds.find(b =>
                (b.atom1.id === this.bondingAtom.id && b.atom2.id === atom.id) ||
                (b.atom2.id === this.bondingAtom.id && b.atom1.id === atom.id)
            );

            if (existingBond) {
                // Upgrade bond type
                existingBond.type = Math.min(3, existingBond.type + 1);
            } else {
                this.bonds.push({
                    atom1: this.bondingAtom,
                    atom2: atom,
                    type: this.selectedBondType
                });
            }

            this.bondingAtom = null;
            this.selectedAtom = null;
            this.updateElectronCount();
            this.updateAtomStatus();
            this.render();
        } else {
            this.bondingAtom = null;
            this.selectedAtom = null;
            this.render();
        }
    }

    handleLonePairClick(x, y) {
        const atom = this.getAtomAt(x, y);
        if (atom) {
            atom.lonePairs++;
            this.updateElectronCount();
            this.updateAtomStatus();
            this.render();
        }
    }

    handleDeleteClick(x, y) {
        const atom = this.getAtomAt(x, y);
        if (atom) {
            // Remove atom and its bonds
            this.atoms = this.atoms.filter(a => a.id !== atom.id);
            this.bonds = this.bonds.filter(b => b.atom1.id !== atom.id && b.atom2.id !== atom.id);
            this.updateElectronCount();
            this.updateAtomStatus();
            this.render();
            return;
        }

        // Check for bond click
        for (let i = this.bonds.length - 1; i >= 0; i--) {
            const bond = this.bonds[i];
            if (this.isPointNearBond(x, y, bond)) {
                if (bond.type > 1) {
                    bond.type--;
                } else {
                    this.bonds.splice(i, 1);
                }
                this.updateElectronCount();
                this.updateAtomStatus();
                this.render();
                return;
            }
        }

        // Check for lone pair click
        for (const atom of this.atoms) {
            if (atom.lonePairs > 0 && this.isPointNearLonePair(x, y, atom)) {
                atom.lonePairs--;
                this.updateElectronCount();
                this.updateAtomStatus();
                this.render();
                return;
            }
        }
    }

    isPointNearBond(x, y, bond) {
        const dx = bond.atom2.x - bond.atom1.x;
        const dy = bond.atom2.y - bond.atom1.y;
        const len = Math.sqrt(dx * dx + dy * dy);

        const t = Math.max(0, Math.min(1, ((x - bond.atom1.x) * dx + (y - bond.atom1.y) * dy) / (len * len)));
        const nearestX = bond.atom1.x + t * dx;
        const nearestY = bond.atom1.y + t * dy;

        const distSq = (x - nearestX) ** 2 + (y - nearestY) ** 2;
        return distSq < 100; // 10px threshold
    }

    isPointNearLonePair(x, y, atom) {
        // Simplified check - just check if near atom and has lone pairs
        const dx = atom.x - x;
        const dy = atom.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < 45 && dist > 25;
    }

    updateElectronCount() {
        let total = -this.moleculeCharge; // Negative charge adds electrons

        for (const atom of this.atoms) {
            total += atom.valence;
        }

        let used = 0;
        for (const bond of this.bonds) {
            used += bond.type * 2;
        }
        for (const atom of this.atoms) {
            used += atom.lonePairs * 2;
        }

        document.getElementById('total-electrons').textContent = total;
        document.getElementById('used-electrons').textContent = used;

        const remaining = total - used;
        const remainingEl = document.getElementById('remaining-electrons');
        remainingEl.textContent = remaining;
        remainingEl.style.color = remaining === 0 ? '#10b981' : remaining < 0 ? '#ef4444' : '#f59e0b';
    }

    updateAtomStatus() {
        const statusContainer = document.getElementById('atom-status');

        if (this.atoms.length === 0) {
            statusContainer.innerHTML = '<p class="status-placeholder">Place atoms to see their electron status</p>';
            return;
        }

        let html = '';
        for (const atom of this.atoms) {
            const electrons = this.getAtomElectrons(atom);
            const target = atom.targetElectrons;
            const satisfied = electrons === target;

            html += `
                <div class="atom-status-item ${satisfied ? 'satisfied' : 'unsatisfied'}">
                    <span class="atom-status-symbol">${atom.element}</span>
                    <span class="atom-status-electrons">${electrons}/${target} e⁻</span>
                </div>
            `;
        }
        statusContainer.innerHTML = html;
    }

    getAtomElectrons(atom) {
        let electrons = atom.lonePairs * 2;

        for (const bond of this.bonds) {
            if (bond.atom1.id === atom.id || bond.atom2.id === atom.id) {
                electrons += bond.type * 2;
            }
        }

        return electrons;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bonds
        for (const bond of this.bonds) {
            this.drawBond(bond);
        }

        // Draw atoms
        for (const atom of this.atoms) {
            this.drawAtom(atom);
        }
    }

    drawAtom(atom) {
        const ctx = this.ctx;
        const radius = 22;

        // Draw selection highlight
        if (this.selectedAtom && this.selectedAtom.id === atom.id) {
            ctx.beginPath();
            ctx.arc(atom.x, atom.y, radius + 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
            ctx.fill();
            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw atom circle
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, radius, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(
            atom.x - 5, atom.y - 5, 0,
            atom.x, atom.y, radius
        );
        gradient.addColorStop(0, this.lightenColor(atom.color, 30));
        gradient.addColorStop(1, atom.color);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = this.darkenColor(atom.color, 20);
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw element symbol
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(atom.element, atom.x, atom.y);

        // Draw lone pairs
        this.drawLonePairs(atom);
    }

    drawLonePairs(atom) {
        if (atom.lonePairs === 0) return;

        const ctx = this.ctx;
        const radius = 32;
        const dotRadius = 4;

        const positions = [
            { angle: -Math.PI / 2 }, // top
            { angle: Math.PI / 2 },  // bottom
            { angle: Math.PI },      // left
            { angle: 0 }             // right
        ];

        // Adjust positions based on bonds
        const bondAngles = this.bonds
            .filter(b => b.atom1.id === atom.id || b.atom2.id === atom.id)
            .map(b => {
                const other = b.atom1.id === atom.id ? b.atom2 : b.atom1;
                return Math.atan2(other.y - atom.y, other.x - atom.x);
            });

        // Find positions furthest from bonds
        const availablePositions = positions.filter(pos => {
            return !bondAngles.some(bondAngle => {
                const diff = Math.abs(pos.angle - bondAngle);
                return diff < 0.5 || diff > Math.PI * 2 - 0.5;
            });
        });

        const positionsToUse = availablePositions.length >= atom.lonePairs
            ? availablePositions.slice(0, atom.lonePairs)
            : positions.slice(0, atom.lonePairs);

        ctx.fillStyle = '#1e293b';

        for (let i = 0; i < atom.lonePairs && i < positionsToUse.length; i++) {
            const pos = positionsToUse[i];
            const x = atom.x + Math.cos(pos.angle) * radius;
            const y = atom.y + Math.sin(pos.angle) * radius;

            // Draw two dots for lone pair
            const perpX = Math.cos(pos.angle + Math.PI / 2) * 6;
            const perpY = Math.sin(pos.angle + Math.PI / 2) * 6;

            ctx.beginPath();
            ctx.arc(x + perpX, y + perpY, dotRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x - perpX, y - perpY, dotRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawBond(bond) {
        const ctx = this.ctx;
        const { atom1, atom2, type } = bond;

        const dx = atom2.x - atom1.x;
        const dy = atom2.y - atom1.y;
        const len = Math.sqrt(dx * dx + dy * dy);

        const nx = dx / len;
        const ny = dy / len;

        // Start and end points (offset from atom centers)
        const startX = atom1.x + nx * 24;
        const startY = atom1.y + ny * 24;
        const endX = atom2.x - nx * 24;
        const endY = atom2.y - ny * 24;

        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        if (type === 1) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        } else if (type === 2) {
            const offset = 4;
            const perpX = -ny * offset;
            const perpY = nx * offset;

            ctx.beginPath();
            ctx.moveTo(startX + perpX, startY + perpY);
            ctx.lineTo(endX + perpX, endY + perpY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(startX - perpX, startY - perpY);
            ctx.lineTo(endX - perpX, endY - perpY);
            ctx.stroke();
        } else if (type === 3) {
            const offset = 6;
            const perpX = -ny * offset;
            const perpY = nx * offset;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(startX + perpX, startY + perpY);
            ctx.lineTo(endX + perpX, endY + perpY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(startX - perpX, startY - perpY);
            ctx.lineTo(endX - perpX, endY - perpY);
            ctx.stroke();
        }
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `rgb(${R}, ${G}, ${B})`;
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `rgb(${R}, ${G}, ${B})`;
    }

    loadProblem(problemId) {
        const problem = this.problems[problemId];
        if (!problem) return;

        this.currentProblem = problemId;
        this.hintIndex = 0;

        // Update UI
        document.querySelectorAll('.problem-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.problem === problemId);
        });

        // Set charge
        this.selectCharge(problem.charge);

        // Clear canvas
        this.reset(false);

        // Show feedback
        this.showFeedback([
            { type: 'info', text: `<strong>${problem.formula}</strong> - ${problem.name}` },
            { type: 'info', text: `Total valence electrons: <strong>${problem.totalElectrons}</strong>` },
            { type: 'info', text: 'Build the structure and click "Check Structure"!' }
        ]);
    }

    checkStructure() {
        if (this.atoms.length === 0) {
            this.showFeedback([
                { type: 'error', text: 'Place some atoms first!' }
            ]);
            return;
        }

        const feedback = [];
        let allCorrect = true;

        // Check electron count
        const totalElectrons = this.atoms.reduce((sum, a) => sum + a.valence, 0) - this.moleculeCharge;
        const usedElectrons = this.bonds.reduce((sum, b) => sum + b.type * 2, 0) +
            this.atoms.reduce((sum, a) => sum + a.lonePairs * 2, 0);

        if (usedElectrons !== totalElectrons) {
            allCorrect = false;
            if (usedElectrons < totalElectrons) {
                feedback.push({
                    type: 'warning',
                    text: `You have ${totalElectrons - usedElectrons} unused electrons. Add more bonds or lone pairs.`
                });
            } else {
                feedback.push({
                    type: 'error',
                    text: `You're using ${usedElectrons - totalElectrons} too many electrons!`
                });
            }
        }

        // Check each atom's octet/duet
        for (const atom of this.atoms) {
            const electrons = this.getAtomElectrons(atom);
            const target = atom.targetElectrons;

            if (electrons < target) {
                allCorrect = false;
                feedback.push({
                    type: 'error',
                    text: `<strong>${atom.element}</strong> has only ${electrons} electrons (needs ${target}). Add more bonds or lone pairs.`
                });
            } else if (electrons > target) {
                allCorrect = false;
                feedback.push({
                    type: 'warning',
                    text: `<strong>${atom.element}</strong> has ${electrons} electrons (more than ${target}). This might be an expanded octet.`
                });
            } else {
                feedback.push({
                    type: 'success',
                    text: `<strong>${atom.element}</strong> has ${electrons} electrons - ${target === 2 ? 'duet' : 'octet'} complete!`
                });
            }
        }

        // Check if all atoms are connected
        if (this.atoms.length > 1 && !this.isConnected()) {
            allCorrect = false;
            feedback.push({
                type: 'error',
                text: 'Not all atoms are connected! Make sure every atom is bonded.'
            });
        }

        if (allCorrect && usedElectrons === totalElectrons) {
            this.showSuccess();
            if (this.currentProblem) {
                this.completedProblems.add(this.currentProblem);
                const problemBtn = document.querySelector(`[data-problem="${this.currentProblem}"]`);
                if (problemBtn) problemBtn.classList.add('completed');
            }
        }

        this.showFeedback(feedback);
    }

    isConnected() {
        if (this.atoms.length === 0) return true;

        const visited = new Set();
        const queue = [this.atoms[0]];
        visited.add(this.atoms[0].id);

        while (queue.length > 0) {
            const atom = queue.shift();
            for (const bond of this.bonds) {
                let neighbor = null;
                if (bond.atom1.id === atom.id) neighbor = bond.atom2;
                else if (bond.atom2.id === atom.id) neighbor = bond.atom1;

                if (neighbor && !visited.has(neighbor.id)) {
                    visited.add(neighbor.id);
                    queue.push(neighbor);
                }
            }
        }

        return visited.size === this.atoms.length;
    }

    showFeedback(items) {
        const container = document.getElementById('feedback-content');

        if (items.length === 0) {
            container.innerHTML = '<div class="feedback-placeholder"><p>Build a structure and click "Check Structure" to get feedback</p></div>';
            return;
        }

        let html = '';
        for (const item of items) {
            let icon = '';
            let className = '';

            switch (item.type) {
                case 'success':
                    icon = '✓';
                    className = 'feedback-success';
                    break;
                case 'error':
                    icon = '✗';
                    className = 'feedback-error';
                    break;
                case 'warning':
                    icon = '⚠';
                    className = 'feedback-warning';
                    break;
                default:
                    icon = 'ℹ';
                    className = '';
            }

            html += `
                <div class="feedback-item">
                    <span class="feedback-icon ${className}">${icon}</span>
                    <span class="feedback-text">${item.text}</span>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    showHint() {
        if (!this.currentProblem) {
            this.showFeedback([
                { type: 'info', text: 'Select a practice problem first!' }
            ]);
            return;
        }

        const problem = this.problems[this.currentProblem];
        const hints = problem.hints;

        if (this.hintIndex < hints.length) {
            this.showFeedback([
                { type: 'info', text: `<strong>Hint ${this.hintIndex + 1}:</strong> ${hints[this.hintIndex]}` }
            ]);
            this.hintIndex++;
        } else {
            this.showFeedback([
                { type: 'info', text: `<strong>Solution:</strong> ${problem.solution.description}` }
            ]);
        }
    }

    showSuccess() {
        const modal = document.getElementById('success-modal');

        const totalElectrons = this.atoms.reduce((sum, a) => sum + a.valence, 0);
        const bondCount = this.bonds.reduce((sum, b) => sum + b.type, 0);
        const lonePairCount = this.atoms.reduce((sum, a) => sum + a.lonePairs, 0);

        document.getElementById('success-electrons').textContent = totalElectrons;
        document.getElementById('success-bonds').textContent = bondCount;
        document.getElementById('success-lonepairs').textContent = lonePairCount;

        if (this.currentProblem) {
            const problem = this.problems[this.currentProblem];
            document.getElementById('success-message').textContent =
                `You correctly drew the Lewis structure for ${problem.name} (${problem.formula})!`;
        }

        modal.classList.add('active');
    }

    nextProblem() {
        this.closeModals();

        const problemKeys = Object.keys(this.problems);
        const currentIndex = problemKeys.indexOf(this.currentProblem);
        const nextIndex = (currentIndex + 1) % problemKeys.length;

        this.loadProblem(problemKeys[nextIndex]);
    }

    reset(clearProblem = true) {
        this.atoms = [];
        this.bonds = [];
        this.bondingAtom = null;
        this.selectedAtom = null;
        this.hintIndex = 0;

        if (clearProblem) {
            this.currentProblem = null;
            document.querySelectorAll('.problem-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.selectCharge(0);
        }

        document.getElementById('canvas-instructions').classList.remove('hidden');
        this.showFeedback([]);
        this.updateElectronCount();
        this.updateAtomStatus();
        this.render();
    }

    // Tutorial
    tutorialStep = 1;
    totalTutorialSteps = 6;

    showTutorial() {
        this.tutorialStep = 1;
        this.updateTutorialUI();
        document.getElementById('tutorial-modal').classList.add('active');
    }

    updateTutorialUI() {
        document.querySelectorAll('.tutorial-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.tutorialStep);
        });

        document.querySelectorAll('.tutorial-dots .dot').forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === this.tutorialStep);
        });

        document.getElementById('tutorial-prev').disabled = this.tutorialStep === 1;

        const nextBtn = document.getElementById('tutorial-next');
        if (this.tutorialStep === this.totalTutorialSteps) {
            nextBtn.textContent = 'Start Building!';
        } else {
            nextBtn.textContent = 'Next →';
        }
    }

    tutorialPrev() {
        if (this.tutorialStep > 1) {
            this.tutorialStep--;
            this.updateTutorialUI();
        }
    }

    tutorialNext() {
        if (this.tutorialStep < this.totalTutorialSteps) {
            this.tutorialStep++;
            this.updateTutorialUI();
        } else {
            this.closeModals();
        }
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.lewisBuilder = new LewisStructureBuilder();
});
