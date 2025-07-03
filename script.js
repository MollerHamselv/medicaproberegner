    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'primary': {
                            50: '#edf7f5',
                            100: '#d1e9e3',
                            200: '#a3d3c7',
                            300: '#75bdab',
                            400: '#47a78f',
                            500: '#2c7c63', /* Hovedfarve */
                            600: '#236352',
                            700: '#1a4a3e',
                            800: '#11322a',
                            900: '#081915',
                        }
                    }
                }
            }
        }
    </script>

    <!-- Add EmailJS script -->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    <script>
        // Initialize EmailJS with your User ID
        (function() {
            emailjs.init('WxsFcH0Ah_J79S9tO'); // Replace with your actual EmailJS user ID
        })();

        // Elementer
        const employeesInput = document.getElementById('employees');
        const avgSalaryInput = document.getElementById('avgSalary');
        const stressPercentInput = document.getElementById('stressPercent');
        const stressPercentValue = document.getElementById('stressPercentValue');
        const absentDaysInput = document.getElementById('absentDays');
        const absentDaysValue = document.getElementById('absentDaysValue');
        const productivityLossInput = document.getElementById('productivityLoss');
        const productivityLossValue = document.getElementById('productivityLossValue');
        const calculateBtn = document.getElementById('calculateBtn');
        
        // Resultat elementer
        const absentCostElement = document.getElementById('absentCost');
        const productivityCostElement = document.getElementById('productivityCost');
        const turnoverCostElement = document.getElementById('turnoverCost');
        const totalCostElement = document.getElementById('totalCost');
        const stressedEmployeesElement = document.getElementById('stressedEmployees');
        const totalEmployeesElement = document.getElementById('totalEmployees');
        const costPerEmployeeElement = document.getElementById('costPerEmployee');
        
        // Graf elementer
        const absentBar = document.getElementById('absentBar');
        const productivityBar = document.getElementById('productivityBar');
        const turnoverBar = document.getElementById('turnoverBar');
        const absentBarValue = document.getElementById('absentBarValue');
        const productivityBarValue = document.getElementById('productivityBarValue');
        const turnoverBarValue = document.getElementById('turnoverBarValue');
        const yMaxLabel = document.getElementById('y-max');
        const yAxisLabels = document.querySelectorAll('.chart-y-axis-label');
        
        // Tabel elementer
        const tableAbsentCost = document.getElementById('tableAbsentCost');
        const tableProductivityCost = document.getElementById('tableProductivityCost');
        const tableTurnoverCost = document.getElementById('tableTurnoverCost');
        const tableTotalCost = document.getElementById('tableTotalCost');
        const tableAbsentPercent = document.getElementById('tableAbsentPercent');
        const tableProductivityPercent = document.getElementById('tableProductivityPercent');
        const tableTurnoverPercent = document.getElementById('tableTurnoverPercent');
        
        // Modal elementer
        const modalTotalCost = document.getElementById('modalTotalCost');
        const modalStressedEmployees = document.getElementById('modalStressedEmployees');
        const modalCostPerEmployee = document.getElementById('modalCostPerEmployee');
        
        // Form hidden fields
        const formTotalCost = document.getElementById('formTotalCost');
        const formStressedEmployees = document.getElementById('formStressedEmployees');
        const formCostPerEmployee = document.getElementById('formCostPerEmployee');
        const formAbsentCost = document.getElementById('formAbsentCost');
        const formProductivityCost = document.getElementById('formProductivityCost');
        const formTurnoverCost = document.getElementById('formTurnoverCost');
        
        // Tab navigation
        const chartTab = document.getElementById('chartTab');
        const tableTab = document.getElementById('tableTab');
        const chartView = document.getElementById('chartView');
        const tableView = document.getElementById('tableView');
        
        // CTA og Modal
        const ctaButton = document.getElementById('ctaButton');
        const ctaModal = document.getElementById('ctaModal');
        const closeModal = document.getElementById('closeModal');
        
        // Kontaktformular
        const contactFormContainer = document.getElementById('contactFormContainer');
        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const formSuccess = document.getElementById('formSuccess');
        
        // Modal funktionalitet
        ctaButton.addEventListener('click', () => {
            ctaModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Forhindrer scrolling af baggrunden
            
            // Opdater modal med de aktuelle beregninger
            updateModalValues();
        });
        
        closeModal.addEventListener('click', () => {
            ctaModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Genaktiverer scrolling
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === ctaModal) {
                ctaModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Opdater modal værdier med aktuelle beregninger
        function updateModalValues() {
            modalTotalCost.textContent = totalCostElement.textContent;
            modalStressedEmployees.textContent = stressedEmployeesElement.textContent;
            modalCostPerEmployee.textContent = costPerEmployeeElement.textContent;
            
            // Opdater skjulte formularfelter
            formTotalCost.value = totalCostElement.textContent;
            formStressedEmployees.value = stressedEmployeesElement.textContent;
            formCostPerEmployee.value = costPerEmployeeElement.textContent;
            formAbsentCost.value = absentCostElement.textContent;
            formProductivityCost.value = productivityCostElement.textContent;
            formTurnoverCost.value = turnoverCostElement.textContent;
        }
        
        chartTab.addEventListener('click', () => {
            chartTab.classList.add('active');
            tableTab.classList.remove('active');
            chartView.classList.remove('hidden');
            tableView.classList.add('hidden');
        });
        
        tableTab.addEventListener('click', () => {
            tableTab.classList.add('active');
            chartTab.classList.remove('active');
            tableView.classList.remove('hidden');
            chartView.classList.add('hidden');
        });
        
        // Opdater værdier når sliders ændres
        stressPercentInput.addEventListener('input', () => {
            stressPercentValue.textContent = `${stressPercentInput.value}%`;
        });
        
        absentDaysInput.addEventListener('input', () => {
            absentDaysValue.textContent = `${absentDaysInput.value} dage`;
        });
        
        productivityLossInput.addEventListener('input', () => {
            productivityLossValue.textContent = `${productivityLossInput.value}%`;
        });
        
        // Beregn omkostninger
        calculateBtn.addEventListener('click', calculateCosts);
        
        // Beregn omkostninger ved indlæsning
        document.addEventListener('DOMContentLoaded', calculateCosts);
        
        // Beregn omkostninger når input ændres (med en lille forsinkelse)
        const inputElements = [employeesInput, avgSalaryInput, stressPercentInput, absentDaysInput, productivityLossInput];
        inputElements.forEach(element => {
            element.addEventListener('input', debounce(calculateCosts, 500));
        });
        
        // Håndter kontaktformular med EmailJS
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Vis loading-indikator
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75');
            submitBtn.innerHTML = 'Sender...';
            
            // Send email via EmailJS
            emailjs.sendForm('service_vqez58l', 'template_d4qaffp', this)
                .then(function() {
                    // Success
                    contactFormContainer.style.display = 'none';
                    formSuccess.classList.remove('hidden');
                }, function(error) {
                    // Error
                    alert('Der opstod en fejl ved afsendelse: ' + JSON.stringify(error));
                })
                .finally(function() {
                    // Nulstil knappen
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('opacity-75');
                    submitBtn.innerHTML = 'Send forespørgsel';
                });
        });
        
        // Debounce funktion for at undgå for mange beregninger
        function debounce(func, wait) {
            let timeout;
            return function() {
                const context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.apply(context, args);
                }, wait);
            };
        }
        
        function calculateCosts() {
            // Tilføj animation til beregningsknappen
            calculateBtn.classList.add('animate-pulse');
            setTimeout(() => {
                calculateBtn.classList.remove('animate-pulse');
            }, 500);
            
            // Hent input værdier
            const employees = parseInt(employeesInput.value) || 0;
            const avgSalary = parseInt(avgSalaryInput.value) || 0;
            const stressPercent = parseInt(stressPercentInput.value) || 0;
            const absentDays = parseInt(absentDaysInput.value) || 0;
            const productivityLoss = parseInt(productivityLossInput.value) || 0;
            
            // Beregn antal stressramte medarbejdere
            const stressedEmployees = Math.round(employees * (stressPercent / 100));
            
            // Beregn daglig løn (antager 22 arbejdsdage pr. måned)
            const dailySalary = avgSalary / 22;
            
            // Beregn omkostninger ved sygefravær
            const absentCost = stressedEmployees * absentDays * dailySalary;
            
            // Beregn produktivitetstab (antager 220 arbejdsdage årligt)
            const workingDays = 220 - absentDays;
            const productivityCost = stressedEmployees * workingDays * dailySalary * (productivityLoss / 100);
            
            // Beregn omkostninger ved udskiftning af personale (antager 10% af stressramte forlader virksomheden)
            // og at det koster 6 måneders løn at erstatte en medarbejder
            const turnoverRate = 0.1;
            const replacementCost = 6 * avgSalary;
            const turnoverCost = stressedEmployees * turnoverRate * replacementCost;
            
            // Beregn samlede omkostninger
            const totalCost = absentCost + productivityCost + turnoverCost;
            
            // Beregn omkostning pr. stressramt medarbejder
            const costPerEmployee = stressedEmployees > 0 ? totalCost / stressedEmployees : 0;
            
            // Opdater resultater med formaterede tal
            absentCostElement.textContent = formatCurrency(absentCost);
            productivityCostElement.textContent = formatCurrency(productivityCost);
            turnoverCostElement.textContent = formatCurrency(turnoverCost);
            totalCostElement.textContent = formatCurrency(totalCost);
            stressedEmployeesElement.textContent = stressedEmployees;
            totalEmployeesElement.textContent = employees;
            costPerEmployeeElement.textContent = formatCurrency(costPerEmployee);
            
            // Opdater Y-akse værdier
            const maxValue = Math.max(absentCost, productivityCost, turnoverCost, 1000); // Minimum 1000 for at undgå tomme grafer
            
            // Afrund maxValue til et pænt tal for y-aksen
            const roundedMax = roundToNiceNumber(maxValue);
            
            // Opdater y-akse labels
            yMaxLabel.textContent = formatCurrency(roundedMax);
            yAxisLabels[1].textContent = formatCurrency(roundedMax * 0.75);
            yAxisLabels[2].textContent = formatCurrency(roundedMax * 0.5);
            yAxisLabels[3].textContent = formatCurrency(roundedMax * 0.25);
            yAxisLabels[4].textContent = formatCurrency(0);
            
            // Opdater søjlehøjder i forhold til den afrundede maksværdi
            absentBar.style.height = `${(absentCost / roundedMax) * 100}%`;
            productivityBar.style.height = `${(productivityCost / roundedMax) * 100}%`;
            turnoverBar.style.height = `${(turnoverCost / roundedMax) * 100}%`;
            
            // Opdater værdier under søjlerne
            absentBarValue.textContent = formatCurrency(absentCost);
            productivityBarValue.textContent = formatCurrency(productivityCost);
            turnoverBarValue.textContent = formatCurrency(turnoverCost);
            
            // Opdater tabel
            tableAbsentCost.textContent = formatCurrency(absentCost);
            tableProductivityCost.textContent = formatCurrency(productivityCost);
            tableTurnoverCost.textContent = formatCurrency(turnoverCost);
            tableTotalCost.textContent = formatCurrency(totalCost);
            
            // Beregn procentdele til tabellen
            if (totalCost > 0) {
                tableAbsentPercent.textContent = `${Math.round((absentCost / totalCost) * 100)}%`;
                tableProductivityPercent.textContent = `${Math.round((productivityCost / totalCost) * 100)}%`;
                tableTurnoverPercent.textContent = `${Math.round((turnoverCost / totalCost) * 100)}%`;
            } else {
                tableAbsentPercent.textContent = '0%';
                tableProductivityPercent.textContent = '0%';
                tableTurnoverPercent.textContent = '0%';
            }
            
            // Opdater modal værdier hvis modalen er åben
            if (ctaModal.style.display === 'block') {
                updateModalValues();
            }
        }
        
        // Afrund til et pænt tal for y-aksen
        function roundToNiceNumber(value) {
            const exponent = Math.floor(Math.log10(value));
            const fraction = value / Math.pow(10, exponent);
            let niceFraction;
            
            if (fraction <= 1.5) {
                niceFraction = 1.5;
            } else if (fraction <= 2) {
                niceFraction = 2;
            } else if (fraction <= 2.5) {
                niceFraction = 2.5;
            } else if (fraction <= 5) {
                niceFraction = 5;
            } else {
                niceFraction = 10;
            }
            
            return niceFraction * Math.pow(10, exponent);
        }
        
        // Formater tal som valuta
        function formatCurrency(amount) {
            return new Intl.NumberFormat('da-DK', {
                style: 'currency',
                currency: 'DKK',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(Math.round(amount));
        }
    </script>
