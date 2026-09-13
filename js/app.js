/**
 * تطبيق مصنع الإنترلوك الديكوري بمدينة بدر 2026
 * التفاعل مع الواجهة، محركات الحساب، الرسوم البيانية، والطباعة
 * Mobile-First | RTL | Enhanced UI/UX 2026 - تحديث شامل سبتمبر 2026
 */

let financialChart = null;
let costBreakdownChart = null;
let currentCatalogFilter = "all";
let currentCatalogSearch = "";
let currentDocMode = "quotation";
let recipeViewMode = "total";

// Chart.js Global Defaults — Light Theme
if (typeof Chart !== "undefined") {
    Chart.defaults.color = "#475569";
    Chart.defaults.font.family = "Cairo, Tajawal, sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = "rgba(15,23,42,0.92)";
    Chart.defaults.plugins.tooltip.titleColor = "#ffffff";
    Chart.defaults.plugins.tooltip.bodyColor = "#e2e8f0";
    Chart.defaults.plugins.tooltip.borderColor = "rgba(0,0,0,0.1)";
    Chart.defaults.plugins.tooltip.borderWidth = 1;
}

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initSidebar();
    initScrollToTop();
    initNavbarScroll();
    initBannerClose();
    initAnimatedCounters();

    // تشغيل دوال العرض والبيانات
    renderCapexTable();
    renderOpexTable();
    renderLaborTable();
    renderUnitEconomicsTable();
    renderScenariosTable();
    renderRoadmap();
    renderRawMaterialsTable();
    renderMixFormulationsMatrix();
    renderMixSecrets();
    renderQualityStandards();
    renderMachines();
    renderCatalog();
    initCatalogSearch();
    renderTroubleshooting();
    renderBadrDirectory();
    renderMultiProductPricesTable();
    renderEquipmentTable();
    renderSuppliersMap();

    // تشغيل المحركات التفاعلية
    initBatchCalculator();
    initFinancialSimulator();
    initContractGenerator();
    initCharts();
});

/* ── Navigation ─────────────────────────────────────────── */
function initNavigation() {
    document.querySelectorAll(".nav-item[data-target]").forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-target");
            switchTab(target);
            closeSidebar();
        });
    });

    document.querySelectorAll("#mobileBottomNav .mobile-nav-item[data-target]").forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-target");
            switchTab(target);
        });
    });

    // Step navigation pills in Section 5
    document.querySelectorAll(".step-nav-pill").forEach(pill => {
        pill.addEventListener("click", (e) => {
            e.preventDefault();
            const href = pill.getAttribute("href");
            const targetEl = document.querySelector(href);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                document.querySelectorAll(".step-nav-pill").forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
            }
        });
    });
}

function switchTab(targetId) {
    document.querySelectorAll(".nav-item[data-target]").forEach(t => {
        if (t.getAttribute("data-target") === targetId) {
            t.classList.add("active");
        } else {
            t.classList.remove("active");
        }
    });

    document.querySelectorAll(".mobile-nav-item[data-target]").forEach(t => {
        if (t.getAttribute("data-target") === targetId) {
            t.classList.add("active");
        } else {
            t.classList.remove("active");
        }
    });

    document.querySelectorAll(".content-section").forEach(sec => {
        if (sec.id === targetId) {
            sec.classList.remove("hidden");
            sec.style.animation = "none";
            sec.offsetHeight; // trigger reflow
            sec.style.animation = "";
        } else {
            sec.classList.add("hidden");
        }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (targetId === "sec-feasibility" && financialChart) {
        setTimeout(() => {
            financialChart.resize();
            financialChart.update();
        }, 150);
    }

    if (targetId === "sec-overview") {
        setTimeout(animateCounters, 200);
    }
}

/* ── Sidebar ─────────────────────────────────────────────── */
function initSidebar() {
    const sidebar = document.getElementById("appSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const toggle  = document.getElementById("sidebarToggle");
    const bottomNavMenu = document.getElementById("bottomNavMenu");
    if (!sidebar) return;

    if (toggle) {
        toggle.addEventListener("click", () => {
            if (sidebar.classList.contains("open")) { closeSidebar(); }
            else { openSidebar(); }
        });
    }

    if (bottomNavMenu) {
        bottomNavMenu.addEventListener("click", (e) => {
            e.preventDefault();
            if (sidebar.classList.contains("open")) { closeSidebar(); }
            else { openSidebar(); }
        });
    }

    if (overlay) overlay.addEventListener("click", closeSidebar);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeSidebar(); });

    // Close sidebar when clicking any navigation link inside it on mobile
    sidebar.querySelectorAll(".nav-item, a").forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth < 1024) {
                closeSidebar();
            }
        });
    });

    // Mark current active bottom nav item
    initMobileBottomNav();
}

function initMobileBottomNav() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const bottomNavItems = document.querySelectorAll("#mobileBottomNav .mobile-nav-item");
    bottomNavItems.forEach(item => {
        const href = item.getAttribute("href");
        if (href && (href === currentPath || (currentPath === "" && href === "index.html"))) {
            item.classList.add("active");
        } else if (href) {
            item.classList.remove("active");
        }
    });
}

function openSidebar() {
    const sidebar = document.getElementById("appSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const toggle  = document.getElementById("sidebarToggle");
    if (!sidebar) return;
    sidebar.classList.add("open");
    if (overlay) overlay.classList.add("visible");
    if (toggle) { toggle.innerHTML = '<i class="fas fa-times"></i>'; }
    document.body.style.overflow = "hidden";
}

function closeSidebar() {
    const sidebar = document.getElementById("appSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const toggle  = document.getElementById("sidebarToggle");
    if (!sidebar) return;
    sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("visible");
    if (toggle) { toggle.innerHTML = '<i class="fas fa-bars"></i>'; }
    document.body.style.overflow = "";
}

/* ── Scroll to Top FAB ───────────────────────────────────── */
function initScrollToTop() {
    const fab = document.getElementById("scrollTopFab");
    if (!fab) return;
    window.addEventListener("scroll", () => {
        fab.classList.toggle("visible", window.scrollY > 300);
    }, { passive: true });
    fab.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ── Navbar Scroll Shadow ────────────────────────────────── */
function initNavbarScroll() {
    const navbar = document.getElementById("mainNavbar");
    if (!navbar) return;
    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 10);
    }, { passive: true });
}

/* ── Banner Close ────────────────────────────────────────── */
function initBannerClose() {
    const btn    = document.getElementById("bannerClose");
    const banner = document.getElementById("topBanner");
    if (!btn || !banner) return;
    btn.addEventListener("click", () => {
        banner.style.transition = "height 0.3s ease, opacity 0.3s ease";
        banner.style.opacity    = "0";
        banner.style.height     = "0";
        banner.style.overflow   = "hidden";
    });
}

/* ── Animated Stat Counters ──────────────────────────────── */
function initAnimatedCounters() {
    if (!window.IntersectionObserver) { animateCounters(); return; }
    const statsGrid = document.querySelector("#sec-overview .grid");
    if (!statsGrid) { animateCounters(); return; }
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateCounters();
            observer.disconnect();
        }
    }, { threshold: 0.3 });
    observer.observe(statsGrid);
}

function animateCounters() {
    document.querySelectorAll(".stat-num[data-target]").forEach(el => {
        const target   = parseFloat(el.getAttribute("data-target"));
        const format   = el.getAttribute("data-format") || "number";
        const duration = 1200;
        const startTime = performance.now();

        function step(now) {
            const elapsed  = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            const current  = target * eased;

            if (format === "currency") {
                el.textContent = Math.round(current).toLocaleString("ar-EG");
            } else if (format === "decimal") {
                el.textContent = (target * eased).toFixed(1);
            } else {
                el.textContent = Math.round(current).toLocaleString("ar-EG");
            }

            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    });
}

/* ── Render Tables & Components ──────────────────────────── */

function renderCapexTable() {
    const tbody = document.getElementById("capexTableBody");
    if (!tbody) return;

    let rowsHtml = "";
    PROJECT_DATA.capexItems.forEach((item, idx) => {
        rowsHtml += `
            <tr class="border-b border-slate-200 hover:bg-amber-50/40 transition">
                <td class="py-3.5 px-4 font-bold text-amber-600">#${idx + 1}</td>
                <td class="py-3.5 px-4">
                    <div class="flex items-center gap-3">
                        <span class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-sm shrink-0">
                            <i class="fas ${item.icon}"></i>
                        </span>
                        <div>
                            <div class="font-bold text-slate-900 text-sm sm:text-base">${item.name}</div>
                            <div class="text-xs text-slate-500 mt-0.5">${item.spec}</div>
                        </div>
                    </div>
                </td>
                <td class="py-3.5 px-4 text-center font-medium text-slate-700">${item.qty}</td>
                <td class="py-3.5 px-4 text-left font-black text-slate-900">${item.total.toLocaleString()} ج.م</td>
            </tr>
        `;
    });
    tbody.innerHTML = rowsHtml;
}

function renderOpexTable() {
    const tbody = document.getElementById("opexTableBody");
    if (!tbody) return;

    let rowsHtml = "";
    let idx = 1;
    for (const key in PROJECT_DATA.opexMonthly) {
        if (key === "totalFixed") continue;
        const item = PROJECT_DATA.opexMonthly[key];
        rowsHtml += `
            <tr class="border-b border-slate-200 hover:bg-amber-50/40 transition">
                <td class="py-3 px-4 font-bold text-amber-600">#${idx++}</td>
                <td class="py-3 px-4 font-bold text-slate-900">${item.name}</td>
                <td class="py-3 px-4 text-xs text-slate-500">${item.note}</td>
                <td class="py-3 px-4 text-left font-black text-slate-900">${item.amount.toLocaleString()} ج.م/شهر</td>
            </tr>
        `;
    }
    tbody.innerHTML = rowsHtml;
}

function renderLaborTable() {
    const tbody = document.getElementById("laborTableBody");
    if (!tbody) return;

    let rowsHtml = "";
    PROJECT_DATA.laborForce.forEach((l, idx) => {
        rowsHtml += `
            <tr class="border-b border-slate-200 hover:bg-amber-50/40 transition">
                <td class="py-3 px-4 font-bold text-amber-600">#${idx + 1}</td>
                <td class="py-3 px-4">
                    <div class="font-bold text-slate-900">${l.role}</div>
                    <div class="text-xs text-slate-500 mt-0.5">${l.desc}</div>
                </td>
                <td class="py-3 px-4 text-center font-bold text-slate-700">${l.count}</td>
                <td class="py-3 px-4 text-center text-slate-700 font-medium">${l.salary.toLocaleString()} ج.م</td>
                <td class="py-3 px-4 text-left font-black text-slate-900">${l.total.toLocaleString()} ج.م</td>
            </tr>
        `;
    });
    tbody.innerHTML = rowsHtml;
}

function renderUnitEconomicsTable() {
    const tbody = document.getElementById("unitEconomicsTableBody");
    if (!tbody) return;

    let rowsHtml = "";
    const items = [
        { key: "thickness6cmColored", name: "إنترلوك ملون ناعم 6 سم (الأكثر مبيعاً)", ...PROJECT_DATA.unitEconomics.thickness6cmColored },
        { key: "thickness6cmGrey", name: "إنترلوك رمادي ناعم 6 سم (بدون أكسيد)", ...PROJECT_DATA.unitEconomics.thickness6cmGrey },
        { key: "thickness4cmColored", name: "إنترلوك ملون 4 سم (مشايات وتراسات ومسابح)", ...PROJECT_DATA.unitEconomics.thickness4cmColored },
        { key: "thickness8cmHeavy", name: "إنترلوك ملون 8 سم (تريلات وسيارات نقل ثقيل)", ...PROJECT_DATA.unitEconomics.thickness8cmHeavy }
    ];

    items.forEach((item, idx) => {
        rowsHtml += `
            <tr class="border-b border-slate-200 hover:bg-amber-50/40 transition">
                <td class="py-3 px-4 font-bold text-amber-600">#${idx + 1}</td>
                <td class="py-3 px-4 font-bold text-slate-900">${item.name}</td>
                <td class="py-3 px-4 text-center text-slate-700">${item.weightKg} كجم</td>
                <td class="py-3 px-4 text-center font-bold text-amber-800">${item.rawMaterialSubtotal.toFixed(2)} ج.م</td>
                <td class="py-3 px-4 text-center text-slate-600">${item.directLabor.toFixed(2)} ج.م</td>
                <td class="py-3 px-4 text-center font-black text-slate-900">${item.totalCost.toFixed(2)} ج.م</td>
                <td class="py-3 px-4 text-center font-black text-blue-700">${item.suggestedSellingPrice.toFixed(2)} ج.م</td>
                <td class="py-3 px-4 text-left font-black text-emerald-700">${item.netProfitPerM2.toFixed(2)} ج.م (${item.profitMarginPercent}%)</td>
            </tr>
        `;
    });
    tbody.innerHTML = rowsHtml;
}

function renderScenariosTable() {
    const container = document.getElementById("scenariosContainer");
    if (!container) return;

    let html = "";
    PROJECT_DATA.scenarios.forEach(sc => {
        html += `
            <div class="light-card rounded-2xl p-5 border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <span class="badge ${sc.statusBadge}">${sc.capacityPercent}% من الطاقة</span>
                        <span class="text-xs font-bold text-slate-500">${sc.monthlyM2.toLocaleString()} م²/شهر</span>
                    </div>
                    <h4 class="font-black text-slate-900 text-base mb-1">${sc.name}</h4>
                    <p class="text-xs text-slate-600 leading-relaxed mb-4">${sc.desc}</p>
                    
                    <div class="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                        <div class="flex justify-between"><span class="text-slate-500">أيام التشغيل:</span><span class="font-bold text-slate-800">${sc.daysWorking} يوم/شهر</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">التغطية السوقية:</span><span class="font-bold text-slate-800">${sc.villasCovered}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">الإيرادات الشهرية:</span><span class="font-black text-slate-900">${sc.revenue.toLocaleString()} ج.م</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">المصاريف الكلية:</span><span class="font-bold text-amber-800">${(sc.variableCosts + sc.fixedOpex).toLocaleString()} ج.م</span></div>
                    </div>
                </div>

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <span class="text-[10px] text-slate-500 block font-bold">صافي الربح الشهري</span>
                        <span class="text-lg font-black text-emerald-600">${sc.netProfit.toLocaleString()} ج.م</span>
                    </div>
                    <div class="text-left">
                        <span class="text-[10px] text-slate-500 block font-bold">عائد سنوي ROI</span>
                        <span class="text-sm font-black text-purple-700">${sc.annualRoi}</span>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderRoadmap() {
    const container = document.getElementById("roadmapContainer");
    if (!container) return;

    let html = "";
    PROJECT_DATA.roadmap.forEach((step, idx) => {
        let tasksHtml = step.tasks.map(t => `<li class="flex items-start gap-2"><i class="fas fa-check-circle text-amber-500 mt-1 shrink-0"></i><span>${t}</span></li>`).join("");
        html += `
            <div class="light-card rounded-2xl p-5 border border-slate-200">
                <div class="flex items-center gap-3 mb-3">
                    <span class="w-8 h-8 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-black text-xs">
                        ${idx + 1}
                    </span>
                    <div>
                        <span class="badge badge-gold text-[10px]">${step.week}</span>
                        <h4 class="font-black text-slate-900 text-sm mt-1">${step.title}</h4>
                    </div>
                </div>
                <ul class="space-y-2 text-xs text-slate-600 leading-relaxed mt-2 pt-2 border-t border-slate-100">
                    ${tasksHtml}
                </ul>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderRawMaterialsTable() {
    const tbody = document.getElementById("rawMaterialsTableBody");
    if (!tbody) return;

    let rowsHtml = "";
    PROJECT_DATA.rawMaterialsPrices.forEach((m, idx) => {
        rowsHtml += `
            <tr class="border-b border-slate-200 hover:bg-amber-50/40 transition">
                <td class="py-3 px-4 font-bold text-amber-600">#${idx + 1}</td>
                <td class="py-3 px-4">
                    <div class="font-bold text-slate-900">${m.item}</div>
                    <div class="text-xs text-slate-500 mt-0.5">${m.note}</div>
                </td>
                <td class="py-3 px-4 text-center font-bold text-amber-700">${m.pricePerKg.toFixed(2)} ج.م</td>
                <td class="py-3 px-4 text-center text-slate-700 font-medium">${m.bag50kg.toLocaleString()} ج.م</td>
                <td class="py-3 px-4 text-center font-black text-slate-900">${m.pricePerTon.toLocaleString()} ج.م</td>
                <td class="py-3 px-4 text-left text-xs text-slate-600">${m.source}</td>
            </tr>
        `;
    });
    tbody.innerHTML = rowsHtml;
}

function renderMultiProductPricesTable() {
    const tbody = document.getElementById("multiProductTableBody");
    if (!tbody || !PROJECT_DATA.multiProductPrices) return;

    const catBadge = {
        interlock: '<span class="badge badge-amber text-[10px]">إنترلوك فاخر</span>',
        stone: '<span class="badge badge-purple text-[10px]">حجر صناعي وواجهات</span>',
        landscape: '<span class="badge badge-emerald text-[10px]">لاندسكيب ومشايات</span>',
        precast: '<span class="badge badge-blue text-[10px]">مسبق الصب ديكوري</span>',
        curbs: '<span class="badge badge-slate text-[10px]">بردورات وأرصفة</span>',
        infrastructure: '<span class="badge badge-cyan text-[10px]">بنية تحتية وصرف</span>'
    };

    let html = "";
    PROJECT_DATA.multiProductPrices.forEach((p, idx) => {
        const badge = catBadge[p.category] || '<span class="badge badge-slate text-[10px]">منتج خرساني</span>';
        html += `
            <tr class="border-b border-slate-100 hover:bg-amber-50/40 transition">
                <td class="py-3.5 px-4 font-bold text-amber-600">#${idx + 1}</td>
                <td class="py-3.5 px-4">
                    <div class="font-bold text-slate-900 text-sm flex items-center gap-2">
                        ${p.product}
                        ${badge}
                    </div>
                    <div class="text-xs text-slate-500 mt-1 leading-relaxed">${p.note}</div>
                </td>
                <td class="py-3.5 px-4 text-center font-bold text-slate-700 font-mono">${p.unit}</td>
                <td class="py-3.5 px-4 text-center">
                    <span class="font-black text-amber-700 text-sm block font-mono">${p.factoryPrice.toLocaleString()} ج.م</span>
                    <span class="text-[10.5px] text-slate-500 font-mono">${p.priceRange}</span>
                </td>
                <td class="py-3.5 px-4 text-center">
                    <span class="font-black text-emerald-700 text-sm block font-mono">${p.installCost.toLocaleString()} ج.م</span>
                    <span class="text-[10.5px] text-slate-500 font-mono">${p.installRange}</span>
                </td>
                <td class="py-3.5 px-4 text-center">
                    <span class="font-black text-slate-900 text-sm block font-mono">${(p.factoryPrice + p.installCost).toLocaleString()} ج.م</span>
                    <span class="text-[10px] text-emerald-600 font-semibold">شامل التركيب والمصنعية</span>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function renderEquipmentTable() {
    const tbody = document.getElementById("equipmentTableBody");
    if (!tbody || !PROJECT_DATA.equipmentAndMolds) return;

    let html = "";
    PROJECT_DATA.equipmentAndMolds.forEach((eq, idx) => {
        html += `
            <tr class="border-b border-slate-100 hover:bg-amber-50/40 transition">
                <td class="py-3.5 px-4 font-bold text-amber-600">#${idx + 1}</td>
                <td class="py-3.5 px-4">
                    <div class="font-bold text-slate-900 text-sm">${eq.item}</div>
                    <div class="text-xs text-slate-500 mt-0.5">${eq.role}</div>
                </td>
                <td class="py-3.5 px-4 text-center font-bold text-slate-700 font-mono">${eq.unit}</td>
                <td class="py-3.5 px-4 text-center">
                    <span class="font-black text-slate-900 text-sm block font-mono">${eq.avgPrice.toLocaleString()} ج.م</span>
                    <span class="text-[10.5px] text-slate-500 font-mono">${eq.priceRange}</span>
                </td>
                <td class="py-3.5 px-4 text-left text-xs text-slate-600">
                    <i class="fas fa-location-dot text-amber-600 ml-1"></i> ${eq.source}
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function renderMixFormulationsMatrix() {
    const tbody = document.getElementById("mixFormulationsTableBody");
    if (!tbody || !PROJECT_DATA.mixFormulations) return;

    let rowsHtml = "";
    PROJECT_DATA.mixFormulations.forEach(f => {
        rowsHtml += `
            <tr class="border-b border-slate-200 hover:bg-amber-50/40 transition">
                <td class="py-3 px-4">
                    <div class="font-black text-slate-900">${f.name}</div>
                    <div class="text-[11px] text-slate-500 mt-0.5">وش ${f.faceThickness} + عصب ${f.baseThickness}</div>
                </td>
                <td class="py-3 px-4 text-center">
                    <span class="badge badge-emerald font-black">${f.targetStrength}</span>
                </td>
                <td class="py-3 px-4 text-center font-bold text-slate-700">${f.absorption}</td>
                <td class="py-3 px-4 text-center font-black text-slate-900">${f.totalWeight}</td>
                <td class="py-3 px-4 text-xs leading-relaxed">
                    <span class="text-amber-800 font-bold">${f.faceMix.whiteCement} أسمنت أبيض</span> + ${f.faceMix.silicaSand} سيليكا + ${f.faceMix.quartzPowder} كوارتز + <span class="text-rose-600 font-bold">${f.faceMix.oxide} أكسيد</span>
                </td>
                <td class="py-3 px-4 text-xs leading-relaxed">
                    <span class="text-slate-900 font-bold">${f.baseMix.greyCement} أسمنت رمادي</span> + ${f.baseMix.dolomite} سن زيرو + ${f.baseMix.coarseSand} رمل
                </td>
                <td class="py-3 px-4 text-center font-black text-amber-700">${f.costPerM2}</td>
                <td class="py-3 px-4 text-center font-black text-blue-700">${f.suggestedPrice}</td>
                <td class="py-3 px-4 text-xs text-slate-600 max-w-[200px] leading-relaxed">${f.bestApplication}</td>
            </tr>
        `;
    });
    tbody.innerHTML = rowsHtml;
}

function renderMixSecrets() {
    const container = document.getElementById("mixSecretsContainer");
    if (!container || !PROJECT_DATA.mixSecrets) return;

    let html = "";
    PROJECT_DATA.mixSecrets.forEach(s => {
        html += `
            <div class="light-card rounded-2xl p-5 border border-slate-200 hover:border-amber-300 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
                <div>
                    <div class="flex items-center justify-between gap-2 mb-3">
                        <span class="badge ${s.badgeClass || 'badge-gold'} text-[10.5px] font-black flex items-center gap-1">
                            <i class="fas ${s.icon || 'fa-flask'}"></i> ${s.badge}
                        </span>
                        <span class="text-[10px] text-slate-400 font-black">#${s.id}</span>
                    </div>
                    <h4 class="font-black text-slate-900 text-sm leading-snug mb-3">
                        ${s.title}
                    </h4>
                    <div class="space-y-2.5 text-xs">
                        <div class="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70 text-amber-950 leading-relaxed">
                            <span class="font-black text-amber-800 block text-[11px] mb-1">
                                <i class="fas fa-microscope text-amber-600"></i> التفسير العلمي والكيميائي:
                            </span>
                            ${s.science}
                        </div>
                        <div class="bg-rose-50/60 p-2.5 rounded-xl border border-rose-200/70 text-rose-950 leading-relaxed">
                            <span class="font-black text-rose-800 block text-[11px] mb-1">
                                <i class="fas fa-triangle-exclamation text-rose-600"></i> الخطأ الشائع والمدمر:
                            </span>
                            ${s.mistake}
                        </div>
                    </div>
                </div>
                <div class="mt-3 pt-2.5 border-t border-slate-100 bg-slate-50/80 -mx-5 -mb-5 p-3.5 rounded-b-2xl">
                    <span class="font-black text-emerald-800 block text-[11px] mb-1">
                        <i class="fas fa-circle-check text-emerald-600"></i> القاعدة الذهبية بالورشة:
                    </span>
                    <p class="text-xs text-slate-700 font-semibold leading-relaxed m-0">${s.goldenRule}</p>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderQualityStandards() {
    const container = document.getElementById("qualityStandardsContainer");
    if (!container) return;

    let html = "";
    PROJECT_DATA.qualityStandards.forEach(q => {
        html += `
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <div class="font-bold text-amber-800 text-xs mb-1 flex items-center gap-1.5">
                    <i class="fas fa-vial-circle-check text-amber-600"></i> ${q.test}
                </div>
                <div class="font-black text-slate-900 text-sm mb-1">${q.standard}</div>
                <div class="text-[11px] text-slate-500 leading-relaxed">${q.condition}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderMachines() {
    const container = document.getElementById("machinesContainer");
    if (!container) return;

    let html = "";
    PROJECT_DATA.machines.forEach(m => {
        html += `
            <div class="light-card rounded-2xl overflow-hidden flex flex-col border border-slate-200 shadow-sm hover:shadow-md transition">
                <div class="h-64 overflow-hidden relative bg-slate-100 flex items-center justify-center p-3 border-b border-slate-100">
                    <img src="${m.image}" alt="${m.name}" class="max-h-full max-w-full object-contain hover:scale-105 transition duration-500 rounded-lg">
                    <span class="absolute top-3 right-3 bg-amber-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                        المعدات المعتمدة 2026
                    </span>
                </div>
                <div class="p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">${m.name}</h3>
                        <div class="space-y-2 text-sm text-slate-600 mb-4">
                            <p><strong class="text-slate-500">السعة والأبعاد:</strong> <span class="text-slate-800 font-medium">${m.capacity}</span></p>
                            <p><strong class="text-slate-500">المحرك والعزم:</strong> <span class="text-slate-800 font-medium">${m.motor}</span></p>
                            <p><strong class="text-slate-500">المتانة والصاج:</strong> <span class="text-slate-800 font-medium">${m.ironSpecs}</span></p>
                            <p><strong class="text-slate-500">معدل الإنتاج:</strong> <span class="text-emerald-700 font-bold">${m.batchCapacity}</span></p>
                        </div>
                    </div>
                    <div class="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed mt-2">
                        <div class="font-bold flex items-center gap-1.5 text-amber-700 mb-1">
                            <i class="fas fa-lightbulb text-amber-600"></i> سر الصنعة في الورشة:
                        </div>
                        ${m.workshopSecret}
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

/* ── Luxury Catalog State & Interactive Engine ───────────── */
function renderCatalog(filter = currentCatalogFilter, search = currentCatalogSearch) {
    currentCatalogFilter = filter;
    currentCatalogSearch = search;

    const container = document.getElementById("catalogContainer");
    const countEl   = document.getElementById("catalogCount");
    if (!container) return;

    let items = PROJECT_DATA.catalog || [];

    // Filter by category
    if (filter !== "all") {
        items = items.filter(item => item.category === filter);
    }

    // Filter by search query
    if (search && search.trim() !== "") {
        const q = search.trim().toLowerCase();
        items = items.filter(item => {
            return (
                (item.name && item.name.toLowerCase().includes(q)) ||
                (item.desc && item.desc.toLowerCase().includes(q)) ||
                (item.bestFor && item.bestFor.toLowerCase().includes(q)) ||
                (item.categoryName && item.categoryName.toLowerCase().includes(q)) ||
                (item.secret && item.secret.toLowerCase().includes(q)) ||
                (item.colors && item.colors.some(c => c.toLowerCase().includes(q)))
            );
        });
    }

    if (countEl) {
        countEl.textContent = `يعرض ${items.length} من ${PROJECT_DATA.catalog.length} موديل معتمد`;
    }

    if (items.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-500 light-card rounded-2xl p-8 border border-slate-200">
                <i class="fas fa-search text-4xl text-slate-300 mb-3"></i>
                <h4 class="text-base font-bold text-slate-700 mb-1">لم يتم العثور على موديلات مطابقة</h4>
                <p class="text-xs text-slate-500">جرب البحث بكلمة أخرى أو اختر تصنيفاً مختلفاً من شريط الفلاتر.</p>
                <button onclick="filterCatalog('all'); if(document.getElementById('catalogSearchInput')) document.getElementById('catalogSearchInput').value='';" class="mt-4 btn-secondary text-xs py-1.5 px-4">
                    إعادة ضبط الفلتر
                </button>
            </div>
        `;
        renderCatalogComparisonTable();
        return;
    }

    let html = "";
    items.forEach(tile => {
        let colorsHtml = tile.colors.map(c => `
            <span class="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                ${c}
            </span>
        `).join(" ");

        html += `
            <div class="light-card rounded-2xl overflow-hidden flex flex-col border border-slate-200 shadow-sm hover:shadow-md transition duration-300 group">
                <!-- Image Header with Badges -->
                <div class="h-64 overflow-hidden relative bg-slate-100 flex items-center justify-center">
                    <img src="${tile.image}" alt="${tile.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent opacity-80"></div>
                    
                    <!-- Top Badges -->
                    <div class="absolute top-3 right-3 flex items-center gap-1.5">
                        <span class="badge ${tile.badgeClass || 'badge-gold'} text-xs font-black shadow-sm">
                            <i class="fas fa-star text-[10px]"></i> ${tile.tierBadge || 'نخب أول'}
                        </span>
                    </div>

                    <div class="absolute top-3 left-3">
                        <span class="bg-slate-900/80 backdrop-blur-md text-white font-bold text-[11px] px-2.5 py-1 rounded-md border border-white/20 shadow-sm">
                            ${tile.categoryName}
                        </span>
                    </div>

                    <!-- Bottom Overlay Details -->
                    <div class="absolute bottom-3 inset-x-3 flex items-center justify-between">
                        <span class="bg-emerald-600 text-white font-black text-xs sm:text-sm px-3 py-1 rounded-lg shadow-md border border-emerald-500/50">
                            ${tile.priceRange}
                        </span>
                        <span class="bg-white/95 backdrop-blur-md text-slate-800 font-bold text-xs px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                            <i class="fas fa-cubes text-amber-600"></i> ${tile.m2Pieces}
                        </span>
                    </div>
                </div>

                <!-- Card Content Body -->
                <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div class="space-y-3">
                        <!-- Dimensions & Thickness -->
                        <div>
                            <div class="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-1">
                                <span><i class="fas fa-ruler-combined text-amber-600"></i> ${tile.dimensions}</span>
                                <span>•</span>
                                <span><i class="fas fa-layer-group text-amber-600"></i> سمك ${tile.thickness}</span>
                            </div>
                            <h3 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-600 transition leading-snug">
                                ${tile.name}
                            </h3>
                        </div>

                        <!-- Description -->
                        <p class="text-xs text-slate-600 leading-relaxed font-normal">
                            ${tile.desc}
                        </p>
                        
                        <!-- Best For Box -->
                        <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                            <div class="text-[11px] text-slate-500 font-bold mb-1 flex items-center gap-1.5">
                                <i class="fas fa-map-pin text-amber-600"></i> أفضل التطبيقات والاستخدامات:
                            </div>
                            <p class="text-xs text-slate-800 font-medium leading-relaxed">${tile.bestFor}</p>
                        </div>

                        <!-- Workshop / Lab Secret -->
                        ${tile.secret ? `
                        <div class="bg-amber-50/60 border border-amber-200/70 rounded-xl p-3">
                            <div class="text-[11px] text-amber-800 font-bold mb-1 flex items-center gap-1.5">
                                <i class="fas fa-flask text-amber-600"></i> سر الخلطة والصب المعملي بالورشة:
                            </div>
                            <p class="text-[11px] text-amber-950 leading-relaxed">${tile.secret}</p>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Colors & Actions -->
                    <div class="pt-3 border-t border-slate-100 space-y-3">
                        <div>
                            <div class="text-[11px] text-slate-500 mb-1.5 font-bold flex items-center gap-1">
                                <i class="fas fa-palette text-amber-600"></i> تشكيلات الألوان المعتمدة:
                            </div>
                            <div class="flex flex-wrap gap-1.5">
                                ${colorsHtml}
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2 pt-1">
                            <button onclick="selectTileForOrder('${tile.id}')" class="btn-primary text-xs py-2.5 px-2 flex items-center justify-center gap-1.5 font-bold shadow-sm">
                                <i class="fas fa-file-invoice"></i> إصدار أمر توريد
                            </button>
                            <button onclick="openCalcForTile('${tile.id}')" class="btn-secondary text-xs py-2.5 px-2 flex items-center justify-center gap-1.5 font-bold shadow-sm">
                                <i class="fas fa-calculator"></i> حاسبة الخلطة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;

    renderCatalogComparisonTable();
}

function filterCatalog(category) {
    document.querySelectorAll("#catalogFilterGroup .catalog-filter-btn").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-filter") === category);
    });
    renderCatalog(category, currentCatalogSearch);
}

function initCatalogSearch() {
    const searchInput = document.getElementById("catalogSearchInput");
    if (!searchInput) return;
    searchInput.addEventListener("input", (e) => {
        renderCatalog(currentCatalogFilter, e.target.value);
    });
}

function renderCatalogComparisonTable() {
    const tbody = document.getElementById("catalogComparisonTableBody");
    if (!tbody) return;

    let rowsHtml = "";
    PROJECT_DATA.catalog.forEach((item, idx) => {
        rowsHtml += `
            <tr class="border-b border-slate-200 hover:bg-amber-50/30 transition">
                <td class="py-3 px-3 font-bold text-amber-600">#${idx + 1}</td>
                <td class="py-3 px-3">
                    <div class="font-bold text-slate-900 text-xs">${item.name}</div>
                    <div class="text-[10px] text-slate-500 mt-0.5">${item.dimensions}</div>
                </td>
                <td class="py-3 px-3">
                    <span class="badge ${item.badgeClass || 'badge-slate'} text-[10px] font-bold">${item.categoryName}</span>
                </td>
                <td class="py-3 px-3 font-medium text-slate-700 text-xs">${item.thickness}</td>
                <td class="py-3 px-3 text-center font-bold text-slate-800">${item.m2Pieces}</td>
                <td class="py-3 px-3 text-center font-black text-emerald-700">${item.priceRange}</td>
                <td class="py-3 px-3 text-slate-600 max-w-xs text-[11px] truncate" title="${item.bestFor}">${item.bestFor}</td>
                <td class="py-3 px-3 text-center">
                    <button onclick="selectTileForOrder('${item.id}')" class="btn-primary text-[11px] py-1 px-2.5 rounded-lg">
                        طلب توريد
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = rowsHtml;
}

function openCalcForTile(tileId) {
    const tile = PROJECT_DATA.catalog.find(c => c.id === tileId);
    switchTab("sec-calculator");
    if (tile) {
        const thicknessSelect = document.getElementById("calcThickness");
        if (thicknessSelect) {
            if (tile.thickness.includes("4")) thicknessSelect.value = "4";
            else if (tile.thickness.includes("6")) thicknessSelect.value = "6";
            else if (tile.thickness.includes("8")) thicknessSelect.value = "8";
        }
        const colorSelect = document.getElementById("calcColor");
        if (colorSelect) colorSelect.value = "colored";
        updateBatchCalculations();
    }
    const calcSec = document.getElementById("sec-calculator");
    if (calcSec) calcSec.scrollIntoView({ behavior: "smooth" });
}

function renderTroubleshooting() {
    const container = document.getElementById("troubleshootingContainer");
    if (!container) return;

    let html = "";
    PROJECT_DATA.troubleshooting.forEach((item, idx) => {
        html += `
            <div class="light-card rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
                <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-2.5">
                        <span class="w-8 h-8 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                            ${idx + 1}
                        </span>
                        <h4 class="font-bold text-slate-900 text-base">${item.symptom}</h4>
                    </div>
                    <span class="badge badge-red text-xs px-2.5 py-0.5 rounded-md font-bold">عيب صب شائع</span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-3 pt-3 border-t border-slate-100">
                    <div class="bg-rose-50/70 rounded-xl p-3.5 border border-rose-200/80">
                        <div class="text-rose-700 font-bold mb-1 flex items-center gap-1.5 text-xs">
                            <i class="fas fa-triangle-exclamation text-rose-500"></i> سبب المشكلة في الورشة:
                        </div>
                        <p class="text-slate-700 text-xs leading-relaxed">${item.cause}</p>
                    </div>
                    <div class="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200/80">
                        <div class="text-emerald-700 font-bold mb-1 flex items-center gap-1.5 text-xs">
                            <i class="fas fa-wrench text-emerald-500"></i> تعمل إيه فوراً عشان متتكررش؟
                        </div>
                        <p class="text-slate-800 text-xs leading-relaxed font-medium">${item.solution}</p>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderBadrDirectory() {
    // 1. Logistics & Market Proximity Hub
    const logContainer = document.getElementById("badrLogisticsHub");
    if (logContainer && PROJECT_DATA.badrDirectory && PROJECT_DATA.badrDirectory.logisticsHub) {
        let html = "";
        PROJECT_DATA.badrDirectory.logisticsHub.forEach(hub => {
            html += `
                <div class="light-card rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-2.5">
                            <span class="badge badge-gold text-xs font-bold"><i class="fas fa-location-arrow ml-1"></i>${hub.distance}</span>
                            <span class="badge badge-green text-xs font-bold"><i class="fas fa-clock ml-1"></i>${hub.time}</span>
                        </div>
                        <h4 class="font-black text-slate-900 text-sm mb-1.5">${hub.destination}</h4>
                        <p class="text-xs text-slate-600 mb-2.5 leading-relaxed font-medium"><i class="fas fa-road text-amber-500 ml-1"></i><strong>المسار:</strong> ${hub.route}</p>
                    </div>
                    <div class="pt-2.5 border-t border-slate-100 text-[11px] text-slate-700 bg-amber-50/50 -mx-5 -mb-5 p-3 rounded-b-2xl">
                        <span class="font-bold text-amber-900"><i class="fas fa-chart-line text-amber-600 ml-1"></i>الفرصة السوقية:</span> ${hub.marketPotential}
                    </div>
                </div>
            `;
        });
        logContainer.innerHTML = html;
    }

    // 2. Raw Materials Master Suppliers
    const rawContainer = document.getElementById("badrRawMaterials");
    if (rawContainer && PROJECT_DATA.badrDirectory && PROJECT_DATA.badrDirectory.rawMaterials) {
        let html = "";
        PROJECT_DATA.badrDirectory.rawMaterials.forEach(m => {
            html += `
                <div class="light-card rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="badge badge-gold text-[11px] font-bold">${m.category}</span>
                            <span class="text-[11px] text-slate-500 font-mono"><i class="fas fa-location-dot text-amber-500 ml-1"></i>${m.distance}</span>
                        </div>
                        <h4 class="font-bold text-slate-900 text-sm mb-1">${m.name}</h4>
                        <p class="text-xs text-slate-600 leading-relaxed mb-2.5">${m.advantage}</p>
                        <div class="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200/80 mb-3 text-slate-700">
                            <i class="fas fa-boxes-packing text-slate-500 ml-1"></i><strong>سعة الشحنة:</strong> ${m.capacity}
                        </div>
                    </div>
                    <div class="text-xs font-bold text-amber-700 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span><i class="fas fa-truck-fast text-amber-600 ml-1"></i>${m.phone}</span>
                        <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">توريد مباشر</span>
                    </div>
                </div>
            `;
        });
        rawContainer.innerHTML = html;
    }

    // 3. Government Authorities & Labs
    const authContainer = document.getElementById("badrAuthorities");
    if (authContainer && PROJECT_DATA.badrDirectory && PROJECT_DATA.badrDirectory.authorities) {
        let html = "";
        PROJECT_DATA.badrDirectory.authorities.forEach(a => {
            html += `
                <div class="light-card rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <div class="flex items-start justify-between gap-2 mb-2">
                            <h4 class="font-black text-slate-900 text-sm leading-snug">${a.org}</h4>
                            <span class="badge badge-blue text-[11px] font-bold shrink-0">${a.time}</span>
                        </div>
                        <p class="text-xs text-slate-600 leading-relaxed mb-3 font-medium">${a.service}</p>
                        <div class="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-2">
                            <div><i class="fas fa-map-pin text-sky-600 ml-1"></i><strong>المقر:</strong> ${a.loc}</div>
                            <div><i class="fas fa-receipt text-amber-600 ml-1"></i><strong>الرسوم المقررة:</strong> <span class="font-bold text-slate-800 font-mono">${a.fees}</span></div>
                        </div>
                    </div>
                    <div class="text-xs font-bold text-slate-700 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span><i class="fas fa-headset text-purple-600 ml-1"></i>${a.phone}</span>
                        <span class="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">بدر الصناعية</span>
                    </div>
                </div>
            `;
        });
        authContainer.innerHTML = html;
    }

    // 4. Licensing Roadmap (IDA 2026)
    const licContainer = document.getElementById("badrLicensingContainer");
    if (licContainer && PROJECT_DATA.badrDirectory && PROJECT_DATA.badrDirectory.licensingRoadmap) {
        let html = "";
        PROJECT_DATA.badrDirectory.licensingRoadmap.forEach(item => {
            html += `
                <div class="relative bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                            <div class="flex items-center gap-2">
                                <span class="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">${item.step}</span>
                                <h4 class="font-bold text-slate-900 text-xs">${item.title}</h4>
                            </div>
                        </div>
                        <p class="text-[11px] text-slate-600 leading-relaxed mb-3">${item.detail}</p>
                    </div>
                    <div class="space-y-1.5 pt-2 border-t border-slate-100">
                        <div class="flex items-center justify-between text-[10px]">
                            <span class="text-slate-500"><i class="fas fa-clock text-slate-400 ml-1"></i>المدة:</span>
                            <span class="font-bold text-slate-800 font-mono">${item.time}</span>
                        </div>
                        <div class="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center justify-between">
                            <span>الرسوم:</span>
                            <span class="font-mono">${item.fees}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        licContainer.innerHTML = html;
    }

    // 5. Initialize Interactive Readiness Checklist
    initReadinessChecklist();
}

function renderSuppliersMap() {
    const container = document.getElementById("suppliersMapContainer");
    if (!container || !PROJECT_DATA.suppliersMap) return;

    let html = "";
    PROJECT_DATA.suppliersMap.forEach((s) => {
        html += `
            <div class="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition space-y-3">
                <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div class="font-black text-slate-900 text-sm flex items-center gap-2">
                        <i class="fas fa-map-location-dot text-amber-600 text-base"></i>
                        <span>${s.region}</span>
                    </div>
                    <span class="badge badge-amber text-[10.5px]">${s.specialty}</span>
                </div>
                <div class="text-xs text-slate-700 leading-relaxed font-tajawal">
                    <strong class="text-slate-900 block mb-1">أبرز الموردين والمنافذ:</strong>
                    ${s.keySuppliers}
                </div>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                    <i class="fas fa-lightbulb text-amber-500 ml-1"></i>
                    <strong>الميزة التنافسية:</strong> ${s.notes}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function initReadinessChecklist() {
    const container = document.getElementById("readinessChecklistContainer");
    if (!container || !PROJECT_DATA.badrDirectory || !PROJECT_DATA.badrDirectory.readinessChecklist) return;

    let html = "";
    PROJECT_DATA.badrDirectory.readinessChecklist.forEach(item => {
        html += `
            <div class="checklist-card ${item.done ? 'checked' : ''}" data-chk-id="${item.id}" onclick="toggleChecklistItem('${item.id}')">
                <input type="checkbox" ${item.done ? 'checked' : ''} id="input_${item.id}" onclick="event.stopPropagation(); toggleChecklistItem('${item.id}');">
                <div class="flex-1">
                    <div class="flex items-center justify-between gap-2 mb-1">
                        <span class="text-xs font-bold text-slate-900 leading-tight">${item.task}</span>
                        <span class="badge badge-gray text-[10px] shrink-0 font-medium">${item.phase}</span>
                    </div>
                    <span class="text-[10px] text-slate-500 status-lbl">
                        ${item.done 
                            ? '<span class="text-emerald-700 font-bold"><i class="fas fa-check-circle ml-1"></i>مستوفى وجاهز للتشغيل</span>' 
                            : '<span class="text-amber-700 font-bold"><i class="fas fa-clock ml-1"></i>قيد التجهيز والمتابعة</span>'}
                    </span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
    updateReadinessScore();
}

function toggleChecklistItem(id) {
    if (!PROJECT_DATA.badrDirectory || !PROJECT_DATA.badrDirectory.readinessChecklist) return;
    const item = PROJECT_DATA.badrDirectory.readinessChecklist.find(c => c.id === id);
    if (!item) return;
    item.done = !item.done;

    const card = document.querySelector(`.checklist-card[data-chk-id="${id}"]`);
    if (card) {
        card.classList.toggle("checked", item.done);
        const chk = card.querySelector('input[type="checkbox"]');
        if (chk) chk.checked = item.done;
        const statusLbl = card.querySelector(".status-lbl");
        if (statusLbl) {
            statusLbl.innerHTML = item.done 
                ? '<span class="text-emerald-700 font-bold"><i class="fas fa-check-circle ml-1"></i>مستوفى وجاهز للتشغيل</span>' 
                : '<span class="text-amber-700 font-bold"><i class="fas fa-clock ml-1"></i>قيد التجهيز والمتابعة</span>';
        }
    }
    updateReadinessScore();
}

function updateReadinessScore() {
    if (!PROJECT_DATA.badrDirectory || !PROJECT_DATA.badrDirectory.readinessChecklist) return;
    const list = PROJECT_DATA.badrDirectory.readinessChecklist;
    const total = list.length;
    if (total === 0) return;
    const doneCount = list.filter(i => i.done).length;
    const percent = Math.round((doneCount / total) * 100);

    const txt = document.getElementById("readinessPercentText");
    const bar = document.getElementById("readinessProgressBar");
    if (txt) txt.innerText = percent + "%";
    if (bar) {
        bar.style.width = percent + "%";
        if (percent === 100) {
            bar.className = "bg-emerald-500 h-3 rounded-full transition-all duration-500";
        } else if (percent >= 70) {
            bar.className = "bg-gradient-to-r from-amber-500 to-emerald-500 h-3 rounded-full transition-all duration-500";
        } else {
            bar.className = "bg-gradient-to-r from-rose-500 to-amber-500 h-3 rounded-full transition-all duration-500";
        }
    }
}

function setRecipeViewMode(mode) {
    recipeViewMode = mode;
    const btnSingle = document.getElementById("btnViewSingleBatch");
    const btnTotal = document.getElementById("btnViewTotalOrder");
    const banner = document.getElementById("recipeModeBanner");
    const bannerText = document.getElementById("recipeModeText");
    const batchTag = document.getElementById("recipeBatchTag");

    if (mode === "single") {
        if (btnSingle) btnSingle.classList.add("active");
        if (btnTotal) btnTotal.classList.remove("active");
        if (banner) banner.className = "bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-blue-900";
        if (bannerText) bannerText.innerText = "يتم الآن عرض مقادير القلبة الواحدة للخلاطة (حلة 125 سم) ليعايرها العمال بالورشة بالجرام والبراويطة.";
        if (batchTag) {
            batchTag.innerText = "القلبة الواحدة (125 سم)";
            batchTag.className = "badge badge-blue text-[10px]";
        }
    } else {
        if (btnSingle) btnSingle.classList.remove("active");
        if (btnTotal) btnTotal.classList.add("active");
        if (banner) banner.className = "bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900";
        if (bannerText) bannerText.innerText = "يتم الآن عرض إجمالي كميات الخامات المطلوبة لصرفها من مخزن المصنع للطلبية بالكامل.";
        if (batchTag) {
            batchTag.innerText = "إجمالي الطلب";
            batchTag.className = "badge badge-gold text-[10px]";
        }
    }

    const areaInput = document.getElementById("calcArea");
    if (areaInput) areaInput.dispatchEvent(new Event("input"));
}

function setAreaPreset(m2) {
    const areaInput = document.getElementById("calcArea");
    if (areaInput) {
        areaInput.value = m2;
        areaInput.dispatchEvent(new Event("input"));
    }
    document.querySelectorAll(".preset-chip").forEach(chip => {
        const text = chip.innerText.replace(/,/g, "").replace(/\s*م²/, "");
        if (text === String(m2)) {
            chip.classList.add("active");
        } else {
            chip.classList.remove("active");
        }
    });
}

function sendBatchToContract() {
    const area = parseFloat(document.getElementById("calcArea")?.value) || 100;
    const thickness = parseInt(document.getElementById("calcThickness")?.value) || 6;

    const contractArea = document.getElementById("contractArea");
    const contractThickness = document.getElementById("contractThickness");

    if (contractArea) contractArea.value = area;
    if (contractThickness) contractThickness.value = thickness;

    switchTab("sec-contract");

    if (contractArea) {
        contractArea.dispatchEvent(new Event("input"));
    }

    showDocToast("تم تصدير كميات وبيانات الطلبية بنجاح إلى مولد العقد وعرض السعر!");
}

function initBatchCalculator() {
    const areaInput = document.getElementById("calcArea");
    const thicknessInput = document.getElementById("calcThickness");
    const colorInput = document.getElementById("calcColor");
    const wasteInput = document.getElementById("calcWaste");
    const mixerCapInput = document.getElementById("calcMixerCap");
    if (!areaInput) return;

    function update() {
        const area = parseFloat(areaInput?.value) || 0;
        const thickness = parseInt(thicknessInput?.value) || 6;
        const isColored = colorInput?.value === "colored";
        const waste = parseFloat(wasteInput?.value) || 5;
        const mixerCap = parseFloat(mixerCapInput?.value) || 2;

        const res = CALCULATORS.calculateBatch(area, thickness, isColored, waste, mixerCap);

        // Logistics & Economics
        if (document.getElementById("outTotalArea")) document.getElementById("outTotalArea").innerText = res.totalAreaWithWaste + " م² بالهالك";
        if (document.getElementById("outDays")) document.getElementById("outDays").innerText = res.daysToProduce + " يوم صب";
        if (document.getElementById("outWeight")) document.getElementById("outWeight").innerText = res.totalWeightTons + " طن";
        if (document.getElementById("outBatches")) document.getElementById("outBatches").innerText = `${res.batchesCount} قلبة (${mixerCap} م²)`;
        if (document.getElementById("outLeadTime")) document.getElementById("outLeadTime").innerText = res.totalLeadDays + " يوم حتى التسليم";

        if (document.getElementById("outRawCost")) document.getElementById("outRawCost").innerText = res.totalRawMaterialCost.toLocaleString() + " ج.م";
        if (document.getElementById("outCostPerM2")) document.getElementById("outCostPerM2").innerText = res.costPerM2Raw.toLocaleString() + " ج.م / م²";
        if (document.getElementById("outEstRevenue")) document.getElementById("outEstRevenue").innerText = res.estimatedRevenue.toLocaleString() + " ج.م";
        if (document.getElementById("outEstGrossMargin")) {
            const margin = res.estimatedGrossMargin;
            document.getElementById("outEstGrossMargin").innerText = (margin >= 0 ? "+" : "") + margin.toLocaleString() + " ج.م";
        }

        if (document.getElementById("outPallets")) document.getElementById("outPallets").innerText = res.accessories.palletsCount + " باليتة";
        if (document.getElementById("outShrink")) document.getElementById("outShrink").innerText = res.accessories.shrinkRolls + " رول";
        if (document.getElementById("outTrucks")) document.getElementById("outTrucks").innerText = res.accessories.trucksCount + " نقلة (15 طن)";

        // Dual Recipe View logic
        if (recipeViewMode === "single") {
            const sb = res.singleBatch;
            if (document.getElementById("outFaceHeaderBadge")) document.getElementById("outFaceHeaderBadge").innerText = `القلبة الواحدة (${mixerCap} م²)`;
            if (document.getElementById("outBaseHeaderBadge")) document.getElementById("outBaseHeaderBadge").innerText = `القلبة الواحدة (${mixerCap} م² - ${sb.batchWeightKg} كجم)`;

            // Face
            if (document.getElementById("outWhiteCement")) document.getElementById("outWhiteCement").innerText = isColored ? `${sb.faceMix.whiteCementKg} كجم (${sb.faceMix.whiteCementBags} شكارة)` : "0 كجم (خلطة رمادية)";
            if (document.getElementById("outSilica")) document.getElementById("outSilica").innerText = isColored ? `${sb.faceMix.silicaSandKg} كجم` : "0 كجم";
            if (document.getElementById("outStonePowder")) document.getElementById("outStonePowder").innerText = isColored ? `${sb.faceMix.stonePowderKg} كجم` : "0 كجم";
            if (document.getElementById("outOxide")) document.getElementById("outOxide").innerText = isColored ? `${sb.faceMix.oxideGrams.toLocaleString()} جرام` : "0 جرام (بدون أكسيد)";
            if (document.getElementById("outFacePce")) document.getElementById("outFacePce").innerText = `${sb.faceMix.pceGrams.toLocaleString()} جرام`;
            if (document.getElementById("outFaceWater")) document.getElementById("outFaceWater").innerText = `${sb.faceMix.waterLiters} لتر (W/C=0.28)`;

            // Base
            if (document.getElementById("outGreyCement")) document.getElementById("outGreyCement").innerText = `${sb.baseMix.greyCementKg} كجم (${sb.baseMix.greyCementBags} شكارة)`;
            if (document.getElementById("outDolomite")) document.getElementById("outDolomite").innerText = `${sb.baseMix.dolomiteKg} كجم (${sb.baseMix.dolomiteBarrows} براويطة)`;
            if (document.getElementById("outCoarseSand")) document.getElementById("outCoarseSand").innerText = `${sb.baseMix.coarseSandKg} كجم (${sb.baseMix.coarseSandBarrows} براويطة)`;
            if (document.getElementById("outBasePce")) document.getElementById("outBasePce").innerText = `${sb.baseMix.pceGrams.toLocaleString()} جرام`;
            if (document.getElementById("outBaseWater")) document.getElementById("outBaseWater").innerText = `${sb.baseMix.waterLiters} لتر (مفلفل)`;
            if (document.getElementById("outOil")) document.getElementById("outOil").innerText = `${(res.accessories.oilLiters / res.batchesCount).toFixed(2)} لتر عزل`;
        } else {
            // Total Order View
            if (document.getElementById("outFaceHeaderBadge")) document.getElementById("outFaceHeaderBadge").innerText = `إجمالي الطلبية (${res.totalAreaWithWaste} م²)`;
            if (document.getElementById("outBaseHeaderBadge")) document.getElementById("outBaseHeaderBadge").innerText = `إجمالي الظهرية (${res.totalAreaWithWaste} م²)`;

            // Face
            if (document.getElementById("outWhiteCement")) document.getElementById("outWhiteCement").innerText = isColored ? `${res.faceMix.whiteCementKg.toLocaleString()} كجم (${res.faceMix.whiteCementBags} شكارة)` : "0 كجم (خلطة رمادية)";
            if (document.getElementById("outSilica")) document.getElementById("outSilica").innerText = isColored ? `${res.faceMix.silicaSandKg.toLocaleString()} كجم` : "0 كجم";
            if (document.getElementById("outStonePowder")) document.getElementById("outStonePowder").innerText = isColored ? `${res.faceMix.stonePowderKg.toLocaleString()} كجم` : "0 كجم";
            if (document.getElementById("outOxide")) document.getElementById("outOxide").innerText = isColored ? `${res.faceMix.oxideKg} كجم (موزون بالجرام)` : "0 كجم (بدون أكسيد)";
            if (document.getElementById("outFacePce")) document.getElementById("outFacePce").innerText = `${res.faceMix.pceKg} كجم`;
            if (document.getElementById("outFaceWater")) document.getElementById("outFaceWater").innerText = `${res.faceMix.waterLiters} لتر`;

            // Base
            if (document.getElementById("outGreyCement")) document.getElementById("outGreyCement").innerText = `${res.baseMix.greyCementKg.toLocaleString()} كجم (${res.baseMix.greyCementBags} شكارة)`;
            if (document.getElementById("outDolomite")) document.getElementById("outDolomite").innerText = `${res.baseMix.dolomiteTons} طن (${res.baseMix.dolomiteBarrowCount} براويطة)`;
            if (document.getElementById("outCoarseSand")) document.getElementById("outCoarseSand").innerText = `${res.baseMix.coarseSandTons} طن`;
            if (document.getElementById("outBasePce")) document.getElementById("outBasePce").innerText = `${res.baseMix.pceKg} كجم`;
            if (document.getElementById("outBaseWater")) document.getElementById("outBaseWater").innerText = `${res.baseMix.waterLiters} لتر`;
            if (document.getElementById("outOil")) document.getElementById("outOil").innerText = `${res.accessories.oilLiters} لتر عزل`;
        }
    }

    [areaInput, thicknessInput, colorInput, wasteInput, mixerCapInput].forEach(el => {
        if (el) el.addEventListener("input", update);
    });

    update();
}

function initFinancialSimulator() {
    const sliderM2 = document.getElementById("simM2");
    const sliderPrice = document.getElementById("simPrice");
    const sliderPremium = document.getElementById("simPremium");
    const sliderWhite = document.getElementById("simWhiteCement");
    const sliderGrey = document.getElementById("simGreyCement");
    if (!sliderM2) return;

    function update() {
        const m2 = parseInt(sliderM2.value);
        const price = parseFloat(sliderPrice.value);
        const premium = parseFloat(sliderPremium.value) / 100;
        const white = parseFloat(sliderWhite.value);
        const grey = parseFloat(sliderGrey.value);

        if (document.getElementById("valSimM2")) document.getElementById("valSimM2").innerText = m2.toLocaleString() + " م²";
        if (document.getElementById("valSimPrice")) document.getElementById("valSimPrice").innerText = price + " ج.م";
        if (document.getElementById("valSimPremium")) document.getElementById("valSimPremium").innerText = Math.round(premium * 100) + " %";
        if (document.getElementById("valSimWhite")) document.getElementById("valSimWhite").innerText = white.toLocaleString() + " ج.م/طن";
        if (document.getElementById("valSimGrey")) document.getElementById("valSimGrey").innerText = grey.toLocaleString() + " ج.م/طن";

        const sim = CALCULATORS.simulateFinancials(m2, price, premium, white, grey);

        if (document.getElementById("resRevenue")) document.getElementById("resRevenue").innerText = sim.monthlyRevenue.toLocaleString() + " ج.م";
        if (document.getElementById("resVarCost")) document.getElementById("resVarCost").innerText = sim.totalVariableCostsMonthly.toLocaleString() + " ج.م";
        if (document.getElementById("resGrossProfit")) document.getElementById("resGrossProfit").innerText = sim.grossProfitMonthly.toLocaleString() + " ج.م";
        if (document.getElementById("resNetProfit")) document.getElementById("resNetProfit").innerText = sim.netProfitMonthly.toLocaleString() + " ج.م";
        if (document.getElementById("resMargin")) document.getElementById("resMargin").innerText = sim.netMarginPercent + " %";
        if (document.getElementById("resBreakEven")) document.getElementById("resBreakEven").innerText = sim.breakEvenM2.toLocaleString() + " م²";
        if (document.getElementById("resPayback")) document.getElementById("resPayback").innerText = sim.paybackMonths + (typeof sim.paybackMonths === "string" && sim.paybackMonths === "غير محقق" ? "" : " شهر");
        if (document.getElementById("resRoi")) document.getElementById("resRoi").innerText = sim.annualRoiPercent + " %";

        const netBox = document.getElementById("resNetProfit");
        if (netBox) {
            if (sim.netProfitMonthly >= 80000) {
                netBox.className = "text-2xl sm:text-3xl font-black text-emerald-600 my-1";
            } else if (sim.netProfitMonthly > 0) {
                netBox.className = "text-2xl sm:text-3xl font-black text-amber-600 my-1";
            } else {
                netBox.className = "text-2xl sm:text-3xl font-black text-rose-600 my-1";
            }
        }

        updateFinancialChart(sim);
    }

    [sliderM2, sliderPrice, sliderPremium, sliderWhite, sliderGrey].forEach(s => {
        if (s) s.addEventListener("input", update);
    });

    update();
}

function initCharts() {
    const costCtx = document.getElementById("costBreakdownChart");
    if (costCtx) {
        costBreakdownChart = new Chart(costCtx, {
            type: "doughnut",
            data: {
                labels: [
                    "أسمنت أبيض (52.5N)",
                    "أسمنت رمادي (42.5N)",
                    "أكاسيد بايفيروكس ألماني",
                    "سن زيرو دولوميت عتاقة",
                    "رمل حرش وسيليكا",
                    "ملدن فائق PCE",
                    "أجور عمالة مباشرة",
                    "مرافق وإهلاك وصيانة"
                ],
                datasets: [{
                    data: [41.60, 38.40, 33.00, 11.55, 7.20, 18.75, 31.33, 16.00],
                    backgroundColor: [
                        "#e2e8f0",
                        "#64748b",
                        "#ef4444",
                        "#d97706",
                        "#f59e0b",
                        "#0284c7",
                        "#10b981",
                        "#8b5cf6"
                    ],
                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { color: "#334155", font: { family: "Cairo", size: 11 } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) { return ` ${ctx.label}: ${ctx.raw.toFixed(2)} ج.م/م²`; }
                        }
                    }
                }
            }
        });
    }

    const finCtx = document.getElementById("financialSimChart");
    if (finCtx) {
        financialChart = new Chart(finCtx, {
            type: "bar",
            data: {
                labels: ["الإيرادات الشهرية", "التكاليف المتغيرة", "المصاريف الثابتة", "صافي الربح الشهري"],
                datasets: [{
                    label: "الجنيه المصري (EGP)",
                    data: [427500, 300500, 59000, 68000],
                    backgroundColor: ["#0284c7", "#d97706", "#8b5cf6", "#10b981"],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) { return ` ${ctx.raw.toLocaleString()} جنيه مصري`; }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: "#334155", font: { family: "Cairo", size: 11, weight: "bold" } },
                        grid: { display: false }
                    },
                    y: {
                        ticks: {
                            color: "#64748b",
                            font: { family: "Cairo" },
                            callback: function(val) { return (val / 1000) + " ألف"; }
                        },
                        grid: { color: "rgba(0,0,0,0.06)" }
                    }
                }
            }
        });
    }
}

function updateFinancialChart(sim) {
    if (!financialChart) return;
    financialChart.data.datasets[0].data = [
        sim.monthlyRevenue,
        sim.totalVariableCostsMonthly,
        sim.fixedOpexMonthly,
        sim.netProfitMonthly
    ];
    financialChart.update();
}

/* ── Document & Contract Engine (3 Modes: Quotation, Contract, Delivery) ── */
function setDocMode(mode) {
    if (!["quotation", "contract", "delivery"].includes(mode)) return;
    currentDocMode = mode;

    // Update Mode Buttons
    const btnQuotation = document.getElementById("btnModeQuotation");
    const btnContract = document.getElementById("btnModeContract");
    const btnDelivery = document.getElementById("btnModeDelivery");

    if (btnQuotation) btnQuotation.classList.toggle("active", mode === "quotation");
    if (btnContract) btnContract.classList.toggle("active", mode === "contract");
    if (btnDelivery) btnDelivery.classList.toggle("active", mode === "delivery");

    // Update Doc Badge
    const badgeContainer = document.getElementById("docModeBadgeContainer");
    if (badgeContainer) {
        if (mode === "quotation") {
            badgeContainer.innerHTML = '<span class="badge badge-amber text-[10px] font-bold" id="docModeBadge">عرض أسعار معتمد (RFQ)</span>';
        } else if (mode === "contract") {
            badgeContainer.innerHTML = '<span class="badge badge-purple text-[10px] font-bold" id="docModeBadge">عقد توريد ملزم قانونياً</span>';
        } else {
            badgeContainer.innerHTML = '<span class="badge badge-green text-[10px] font-bold" id="docModeBadge">إذن صرف وتشغيل وبوليصة شحن</span>';
        }
    }

    // Update Title
    const titleEl = document.getElementById("docTitle");
    if (titleEl) {
        if (mode === "quotation") {
            titleEl.innerText = "عرض أسعار ومواصفات فنية معتمدة (Official Quotation / RFQ)";
        } else if (mode === "contract") {
            titleEl.innerText = "عقد اتفاق وتوريد إنترلوك ديكوري ناعم (Binding Supply Agreement)";
        } else {
            titleEl.innerText = "إذن صرف مخزني وبوليصة تسليم موقعية (Delivery Manifest & Dispatch Note)";
        }
    }

    // Update Preamble Intro
    const introEl = document.getElementById("docPreambleIntro");
    if (introEl) {
        if (mode === "quotation") {
            introEl.innerText = "بناءً على طلب واستفسار العميل الموقر، يسر إدارة المشروعات والتوريدات بالمصنع تقديم المواصفات والأسعار التالية:";
        } else if (mode === "contract") {
            introEl.innerText = "إنه في يوم الموافق لتاريخه، تم الاتفاق والتعاقد بالتراضي التام بين الطرفين التاليين وفقاً للقانون المدني والأعراف التجارية:";
        } else {
            introEl.innerText = "تصريح خروج بضاعة معتمد من مستودعات المصنع بالمنطقة الصناعية بمدينة بدر لصالح الموقع والعميل الموضحين أدناه:";
        }
    }

    // Update Signatures Titles
    const sigTitle1 = document.getElementById("sigTitle1");
    const sigTitle2 = document.getElementById("sigTitle2");
    if (sigTitle1 && sigTitle2) {
        if (mode === "quotation") {
            sigTitle1.innerText = "إعداد ومتابعة المبيعات:";
            sigTitle2.innerText = "اعتماد وقبول العميل:";
        } else if (mode === "contract") {
            sigTitle1.innerText = "توقيع الطرف الأول (المورّد والمصنع):";
            sigTitle2.innerText = "توقيع الطرف الثاني (العميل/المقاول):";
        } else {
            sigTitle1.innerText = "أمين المخزن والمراقبة الصناعية:";
            sigTitle2.innerText = "استلام السائق ومهندس الموقع:";
        }
    }

    // Regenerate code prefix
    regenerateDocNumber();

    // Re-render calculations and terms
    if (window.updateContract) window.updateContract();
}

function regenerateDocNumber() {
    const randomDigits = Math.floor(100 + Math.random() * 900);
    let prefix = "RFQ-MDM-2026-";
    if (currentDocMode === "contract") prefix = "CTR-MDM-2026-";
    else if (currentDocMode === "delivery") prefix = "DSP-MDM-2026-";
    const docNumberEl = document.getElementById("docNumber");
    if (docNumberEl) docNumberEl.innerText = prefix + randomDigits;
}

function tafqeet(n) {
    if (!n || isNaN(n) || n <= 0) return "صفر جنيه مصري لا غير";
    n = Math.floor(n);
    const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
        'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
    const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

    function convertGroup(val) {
        let str = '';
        const h = Math.floor(val / 100);
        const rem = val % 100;
        if (h > 0) str += hundreds[h];
        if (rem > 0) {
            if (h > 0) str += ' و';
            if (rem < 20) {
                str += ones[rem];
            } else {
                const t = Math.floor(rem / 10);
                const o = rem % 10;
                if (o > 0) str += ones[o] + ' و' + tens[t];
                else str += tens[t];
            }
        }
        return str;
    }

    let parts = [];
    const millions = Math.floor(n / 1000000);
    const thousands = Math.floor((n % 1000000) / 1000);
    const remainder = n % 1000;

    if (millions > 0) {
        if (millions === 1) parts.push('مليون');
        else if (millions === 2) parts.push('مليونان');
        else if ((millions % 100) >= 3 && (millions % 100) <= 10) parts.push(convertGroup(millions) + ' ملايين');
        else parts.push(convertGroup(millions) + ' مليون');
    }

    if (thousands > 0) {
        if (thousands === 1) parts.push('ألف');
        else if (thousands === 2) parts.push('ألفان');
        else if ((thousands % 100) >= 3 && (thousands % 100) <= 10) parts.push(convertGroup(thousands) + ' آلاف');
        else parts.push(convertGroup(thousands) + ' ألف');
    }

    if (remainder > 0) {
        parts.push(convertGroup(remainder));
    }

    return 'فقط ' + parts.join(' و') + ' جنيه مصري لا غير';
}

function initContractGenerator() {
    const clientNameInput = document.getElementById("clientName") || document.getElementById("contractClientName");
    const clientPhoneInput = document.getElementById("clientPhone") || document.getElementById("contractClientPhone");
    const taxIdInput = document.getElementById("clientTax") || document.getElementById("contractTaxId");
    const locationInput = document.getElementById("projectLocation") || document.getElementById("contractLocation");
    const modelSelect = document.getElementById("tileTypeSelect") || document.getElementById("contractModel");
    const supplyTypeSelect = document.getElementById("contractSupplyType");
    const areaInput = document.getElementById("contractArea");
    const priceInput = document.getElementById("contractPrice");
    const depositPercentInput = document.getElementById("downPaymentPercent") || document.getElementById("contractDepositRatio");
    const leadTimeInput = document.getElementById("deliveryDays") || document.getElementById("contractLeadTime");

    // Product mapping dictionary
    const productCatalog = {
        "3d_cube": { name: "إنترلوك ناعم 6 سم ملون 3D", unit: "م²", factoryPrice: 160, installCost: 75, strength: 450, note: "الأكثر طلباً للفلل ومواقف السيارات الخاصة" },
        "interlock_6cm": { name: "إنترلوك ناعم 6 سم ملون 3D", unit: "م²", factoryPrice: 160, installCost: 75, strength: 450, note: "الأكثر طلباً للفلل ومواقف السيارات الخاصة" },
        "wood_plank": { name: "إنترلوك ناعم 4 سم (مشايات حدائق)", unit: "م²", factoryPrice: 105, installCost: 65, strength: 400, note: "للأحمال الخفيفة وممرات المشاة والنوادي" },
        "interlock_4cm": { name: "إنترلوك ناعم 4 سم (مشايات حدائق)", unit: "م²", factoryPrice: 105, installCost: 65, strength: 400, note: "للأحمال الخفيفة وممرات المشاة والنوادي" },
        "heavy_duty": { name: "إنترلوك 8 سم (أحمال شاقة للمصانع)", unit: "م²", factoryPrice: 190, installCost: 80, strength: 520, note: "لسيارات النقل الثقيل والتريلات ومحطات الوقود والمناطق الصناعية" },
        "interlock_8cm": { name: "إنترلوك 8 سم (أحمال شاقة للمصانع)", unit: "م²", factoryPrice: 190, installCost: 80, strength: 520, note: "لسيارات النقل الثقيل والتريلات ومحطات الوقود والمناطق الصناعية" },
        "stone_cladding": { name: "حجر صناعي / تكسية واجهات معمارية", unit: "م²", factoryPrice: 350, installCost: 115, strength: 400, note: "بديل الحجر الطبيعي؛ صب في قوالب بولي يوريثان" },
        "wood_crete": { name: "بديل خشب خرساني (Wood-Crete)", unit: "م²", factoryPrice: 350, installCost: 90, strength: 420, note: "شرائح محاكية لتجزيعات الخشب مقاومة للشمس والمياه" },
        "exposed_aggregate": { name: "مشايات حدائق ركام مكشوف (Exposed Aggregate)", unit: "م²", factoryPrice: 230, installCost: 75, strength: 450, note: "أسطح مغسولة بمثبط الشك لإبراز كسر الجرانيت والرخام" },
        "granix": { name: "مشايات حدائق ركام مكشوف (Exposed Aggregate)", unit: "م²", factoryPrice: 230, installCost: 75, strength: 450, note: "أسطح مغسولة بمثبط الشك لإبراز كسر الجرانيت والرخام" },
        "wall_coping": { name: "طبانات أسوار وتيجان أعمدة ديكورية", unit: "م.ط", factoryPrice: 115, installCost: 45, strength: 380, note: "حماية الأسوار الخارجية وإعطاء لمسة معمارية كلاسيكية" },
        "garden_curb": { name: "بردورة حدائق خرسانية (50×20×10 سم)", unit: "م.ط", factoryPrice: 60, installCost: 25, strength: 350, note: "تحديد أرصفة الحدائق ومسارات السيارات" },
        "fish_scale": { name: "إنترلوك قشور السمك الأندلسية (6 سم)", unit: "م²", factoryPrice: 165, installCost: 75, strength: 450, note: "طراز كلاسيكي راقٍ لممرات الفلل والقصور" },
        "u_drain": { name: "مجاري صرف مياه خرسانية (U-Drains)", unit: "م.ط", factoryPrice: 225, installCost: 50, strength: 450, note: "قنوات تصريف مياه الأمطار حول المسابح والفلل" }
    };

    function autoUpdatePrice() {
        const val = modelSelect ? modelSelect.value : "interlock_6cm";
        const prod = productCatalog[val] || productCatalog["interlock_6cm"];
        const supplyType = supplyTypeSelect ? supplyTypeSelect.value : "supply_only";
        const defaultPrice = (supplyType === "supply_install") ? (prod.factoryPrice + prod.installCost) : prod.factoryPrice;
        if (priceInput) priceInput.value = defaultPrice;
        updateContract();
    }

    if (modelSelect) modelSelect.addEventListener("change", autoUpdatePrice);
    if (supplyTypeSelect) supplyTypeSelect.addEventListener("change", autoUpdatePrice);

    function updateContract() {
        const name = (clientNameInput && clientNameInput.value.trim()) || "السادة / شركة التطوير والاستثمار العقاري";
        const phone = (clientPhoneInput && clientPhoneInput.value.trim()) || "01xxxxxxxxx";
        const taxId = (taxIdInput && taxIdInput.value.trim()) || "س.ت: 49821 / ب.ض: 512-304";
        const loc = (locationInput && locationInput.value.trim()) || "كمبوند الفلل - القاهرة الجديدة / مدينة بدر";
        const modelVal = modelSelect ? modelSelect.value : "interlock_6cm";
        const prod = productCatalog[modelVal] || productCatalog["interlock_6cm"];
        const supplyType = supplyTypeSelect ? supplyTypeSelect.value : "supply_only";
        const isSupplyAndInstall = (supplyType === "supply_install");
        const area = parseFloat(areaInput ? areaInput.value : 0) || 0;
        const price = parseFloat(priceInput ? priceInput.value : prod.factoryPrice) || prod.factoryPrice;
        const depositPercent = parseFloat(depositPercentInput ? depositPercentInput.value : 50) || 50;
        const leadDays = (leadTimeInput && leadTimeInput.value) || 12;

        const subtotal = Math.round(area * price);
        const deposit = Math.round(subtotal * (depositPercent / 100));
        const balance = subtotal - deposit;
        const tafqeetText = tafqeet(subtotal);

        // Update sheet header badges
        const badgeEl = document.getElementById("docTypeBadge");
        if (badgeEl) {
            badgeEl.innerText = (currentDocMode === "contract") ? "عقد توريد رسمي معتمد" : "عرض أسعار ومواصفات فنية";
            badgeEl.className = (currentDocMode === "contract") ? "bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold" : "bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-bold";
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
        if (document.getElementById("docDateDisplay")) document.getElementById("docDateDisplay").innerText = dateStr;

        const supplyTypeText = isSupplyAndInstall ? "توريد وتركيب شامل المصنعية والمؤن" : "توريد أرض المصنع / شامل النقل";
        const supplyTypeBadge = isSupplyAndInstall ? "badge-emerald" : "badge-amber";

        // Terms content
        let termsHtml = "";
        if (currentDocMode === "contract") {
            termsHtml = `
                <div class="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <i class="fas fa-shield-halved text-amber-600"></i> بنود وشروط التعاقد الإلزامية (وفق أحكام القانون المدني المصري رقم 131 لسنة 1948):
                </div>
                <p><strong>البند الأول (المطابقة الفنية):</strong> يلتزم الطرف الأول بتوريد منتجات خرسانية Wet-Cast مطابقة للمواصفة القياسية المصرية (ES 4382) ومفحوصة معملياً بإجهاد كسر لا يقل عن <strong class="text-amber-900">${prod.strength} كجم/سم²</strong> ونسبة امتصاص مياه ≤ 4%.</p>
                <p><strong>البند الثاني (شروط السداد الصارمة):</strong> سداد الدفعة المقدمة وقدرها (<span class="font-bold text-amber-900 font-mono">${deposit.toLocaleString()} ج.م</span>) تمثل ${depositPercent}% كاش عند التوقيع لشراء الخامات وجدولة الصب؛ ويلتزم الطرف الثاني بسداد باقي القيمة وقدرها (<span class="font-bold text-emerald-900 font-mono">${balance.toLocaleString()} ج.م</span>) نقداً فور وصول سيارة النقل للموقع وقبل تنزيل أو تفريغ أي بلاطة على الأرض (شرط مانع للتنزيل والعتالة).</p>
                <p><strong>البند الثالث (عينة الشاهد):</strong> تم توقيع واعتماد بلاطة شاهد تعتبر المرجع الفني والقانوني الوحيد لمطابقة النعومة والألوان وإجهاد الكسر، وتسقط أي اعتراضات ظاهرية بعد تفريغ الشحنة.</p>
                <p><strong>البند الرابع (المدة والهالك):</strong> مدة التوريد المقررة (<span class="font-bold text-slate-900 font-mono">${leadDays} يوم عمل</span>) تبدأ من تاريخ سداد الدفعة المقدمة، ونسبة الهالك المسموح بها كودياً لا تتعدى 2% أثناء النقل.</p>
                <p><strong>البند الخامس (الاختصاص القضائي):</strong> أي نزاع ينشأ عن تنفيذ أو تفسير هذا العقد يكون من اختصاص محاكم القاهرة الجديدة ومأمورية مدينة بدر الابتدائية.</p>
            `;
        } else {
            termsHtml = `
                <div class="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <i class="fas fa-file-invoice-dollar text-blue-600"></i> شروط صلاحية العرض والاعتماد التجاري (مدينة بدر 2026):
                </div>
                <p>1. <strong>صلاحية الأسعار:</strong> يسري هذا العرض لمدة 15 يوماً تقويمياً من تاريخه، نظراً لتذبذب أسعار خامات الأسمنت الأبيض والأكاسيد المستوردة.</p>
                <p>2. <strong>شروط السداد:</strong> سداد دفعة مقدمة <span class="font-bold text-amber-900 font-mono">${depositPercent}%</span> (${deposit.toLocaleString()} ج.م) عند اعتماد أمر الشراء، والمتبقي (${balance.toLocaleString()} ج.م) نقداً فور وصول سيارة النقل وقبل التنزيل والتفريغ بالموقع.</p>
                <p>3. <strong>الجدول الزمني:</strong> مدة التنفيذ والتوريد المقدرة (${leadDays} يوم عمل) من تاريخ استلام الدفعة المقدمة واعتماد عينة الشاهد الموقعة.</p>
                <p>4. <strong>عينة الشاهد المجانية:</strong> يوفر المصنع عينة بلاطة نموذجية معتمدة لمعاينة السطح الرخامي وإجهاد الكسر بالموقع قبل بدء الإنتاج الكمي.</p>
            `;
        }

        const bodyContainer = document.getElementById("docBodyContent");
        if (bodyContainer) {
            bodyContainer.innerHTML = `
                <div class="space-y-5">
                    <!-- Preamble & Parties -->
                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                        <div class="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                            <span><i class="fas fa-handshake text-amber-600 ml-1"></i> ديباجة التعاقد والأطراف الرسمية:</span>
                            <span class="text-[11px] text-slate-500 font-mono">المنطقة الصناعية - مدينة بدر</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                            <div>
                                <strong class="text-slate-900 block mb-0.5">الطرف الأول (المصنع والمورّد):</strong>
                                <span class="font-bold text-slate-900">شركة مِدماك للحلول الخرسانية والإنترلوك (MADMAK)</span><br>
                                <span class="text-[11px] text-slate-500">سجل صناعي: 104882 | بطاقة ضريبية: 684-219-503 | طريق الروبيكي الصناعي</span>
                            </div>
                            <div>
                                <strong class="text-slate-900 block mb-0.5">الطرف الثاني (العميل / المقاول):</strong>
                                <span class="font-bold text-slate-900">${name}</span><br>
                                <span class="text-[11px] text-slate-600">هاتف: <span class="font-mono font-bold text-slate-800">${phone}</span> | س.ت / قيد: <span class="font-mono">${taxId}</span></span><br>
                                <span class="text-[11px] text-slate-600">موقع التسليم: <strong class="text-slate-800">${loc}</strong></span>
                            </div>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <div class="overflow-x-auto border border-slate-200 rounded-xl">
                        <table class="w-full text-right text-xs">
                            <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                                <tr>
                                    <th class="py-2.5 px-3">م</th>
                                    <th class="py-2.5 px-3">بيان الصنف والمواصفة الفنية</th>
                                    <th class="py-2.5 px-3 text-center">نوع الخدمة</th>
                                    <th class="py-2.5 px-3 text-center">الكمية</th>
                                    <th class="py-2.5 px-3 text-center">سعر الفئة</th>
                                    <th class="py-2.5 px-3 text-left">الإجمالي</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 bg-white">
                                <tr>
                                    <td class="py-3 px-3 font-bold text-amber-600">1</td>
                                    <td class="py-3 px-3">
                                        <strong class="text-slate-900 block">${prod.name}</strong>
                                        <span class="text-[11px] text-slate-500">${prod.note} — إجهاد كسر ≥ ${prod.strength} كجم/سم² (معمل جامعة بدر BUC)</span>
                                    </td>
                                    <td class="py-3 px-3 text-center">
                                        <span class="badge ${supplyTypeBadge} text-[10.5px]">${supplyTypeText}</span>
                                    </td>
                                    <td class="py-3 px-3 text-center font-bold font-mono text-slate-800">${area.toLocaleString()} ${prod.unit}</td>
                                    <td class="py-3 px-3 text-center font-bold font-mono text-amber-800">${price.toLocaleString()} ج.م</td>
                                    <td class="py-3 px-3 text-left font-black font-mono text-slate-900">${subtotal.toLocaleString()} ج.م</td>
                                </tr>
                            </tbody>
                            <tfoot class="bg-amber-50/60 font-bold border-t border-amber-200 text-slate-900">
                                <tr>
                                    <td colspan="5" class="py-3 px-3 text-xs">إجمالي القيمة الإجمالية المستحقة:</td>
                                    <td class="py-3 px-3 text-left text-sm font-black text-amber-800 font-mono">${subtotal.toLocaleString()} ج.م</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <!-- Tafqeet & Payment Schedule -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                            <span class="text-[11px] text-slate-500 font-bold block">المبلغ الإجمالي بالحروف العربية:</span>
                            <span class="font-bold text-slate-900 block">${tafqeetText}</span>
                        </div>
                        <div class="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1">
                            <div class="flex justify-between">
                                <span>الدفعة المقدمة (${depositPercent}%):</span>
                                <strong class="text-amber-900 font-mono">${deposit.toLocaleString()} ج.م</strong>
                            </div>
                            <div class="flex justify-between">
                                <span>المتبقي قبل التنزيل والتفريغ (${100 - depositPercent}%):</span>
                                <strong class="text-emerald-900 font-mono">${balance.toLocaleString()} ج.م</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Terms & Conditions (Mode-specific) -->
                    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700 leading-relaxed font-tajawal">
                        ${termsHtml}
                    </div>
                </div>
            `;
        }
    }

    window.updateContract = updateContract;

    const allInputs = [
        clientNameInput, clientPhoneInput, taxIdInput, locationInput,
        modelSelect, supplyTypeSelect, areaInput, priceInput, depositPercentInput, leadTimeInput
    ];

    allInputs.forEach(el => {
        if (el) {
            el.addEventListener("input", updateContract);
            el.addEventListener("change", updateContract);
        }
    });

    updateContract();
}


function copyDocText() {
    const docNumber = document.getElementById("docNumber") ? document.getElementById("docNumber").innerText : "";
    const docDate = document.getElementById("docDate") ? document.getElementById("docDate").innerText : "";
    const title = document.getElementById("docTitle") ? document.getElementById("docTitle").innerText : "";
    const client = document.getElementById("contractClientName") ? document.getElementById("contractClientName").value : "";
    const phone = document.getElementById("contractClientPhone") ? document.getElementById("contractClientPhone").value : "";
    const location = document.getElementById("contractLocation") ? document.getElementById("contractLocation").value : "";
    const model = document.getElementById("docModel") ? document.getElementById("docModel").innerText : "";
    const thickness = document.getElementById("docThickness") ? document.getElementById("docThickness").innerText : "";
    const area = document.getElementById("docArea") ? document.getElementById("docArea").innerText : "";
    const unitPrice = document.getElementById("docPrice") ? document.getElementById("docPrice").innerText : "";
    const total = document.getElementById("docGrandTotal") ? document.getElementById("docGrandTotal").innerText : "";
    const tafqeetText = document.getElementById("docTafqeet") ? document.getElementById("docTafqeet").innerText : "";

    const textToCopy = `=====================================================
شركة مِدماك للحلول الخرسانية والإنترلوك الديكوري
MADMAK CONCRETE SOLUTIONS | كود المصنع: MDM-2026
المنطقة الصناعية - طريق الروبيكي - مدينة بدر
سجل صناعي: 104882 / قاهرة | بطاقة ضريبية: 684-219-503
=====================================================
${title}
كود الوثيقة: ${docNumber} | التاريخ: ${docDate}
-----------------------------------------------------
بيانات الطرف الثاني (العميل):
- الاسم / الشركة: ${client}
- الهاتف: ${phone}
- موقع التوريد: ${location}
-----------------------------------------------------
المواصفات الفنية والمالية:
- الموديل: ${model}
- السمك والتطبيق: ${thickness}
- الكمية الصافية: ${area}
- سعر الوحدة: ${unitPrice}
- إجمالي القيمة المستحقة: ${total}
- المبلغ بالحروف: ${tafqeetText}
-----------------------------------------------------
شركة مِدماك للحلول الخرسانية (MADMAK) - صب رطب Wet-Cast فائق الجودة
=====================================================`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showDocToast("تم نسخ نص الوثيقة إلى الحافظة بنجاح!");
        }).catch(() => {
            showDocToast("تم نسخ نص الوثيقة بنجاح!");
        });
    } else {
        showDocToast("تم نسخ نص الوثيقة بنجاح!");
    }
}

function showDocToast(msg) {
    const toast = document.getElementById("docToast");
    const msgEl = document.getElementById("docToastMsg");
    if (!toast) return;
    if (msgEl && msg) msgEl.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

function selectTileForOrder(tileId) {
    switchTab("sec-contract");
    const modelSelect = document.getElementById("contractModel");
    if (modelSelect) {
        modelSelect.value = tileId;
        modelSelect.dispatchEvent(new Event("input"));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function printWorkOrder() {
    const area = parseFloat(document.getElementById("calcArea")?.value) || 100;
    const thickness = parseInt(document.getElementById("calcThickness")?.value) || 6;
    const isColored = document.getElementById("calcColor")?.value === "colored";
    const waste = parseFloat(document.getElementById("calcWaste")?.value) || 5;
    const mixerCap = parseFloat(document.getElementById("calcMixerCap")?.value) || 2;

    const res = CALCULATORS.calculateBatch(area, thickness, isColored, waste, mixerCap);
    const sb = res.singleBatch;

    const printWin = window.open("", "_blank", "width=900,height=950");
    printWin.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>أمر تشغيل وصب ميداني - شركة مِدماك للحلول الخرسانية (MADMAK) 2026</title>
            <style>
                body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; padding: 25px; color: #0f172a; font-size: 11.5px; line-height: 1.5; }
                .header { text-align: center; border-bottom: 2.5px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
                .header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
                .header-logo { width: 50px; height: 50px; object-contain: contain; }
                .header h2 { margin: 0 0 4px 0; font-size: 19px; font-weight: 900; }
                .header p { margin: 0; font-size: 11px; color: #475569; }
                .meta-badges { margin-top: 8px; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
                .badge { display: inline-block; padding: 3px 10px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; font-weight: bold; font-size: 11px; }
                .badge-gold { background: #fef3c7; border-color: #f59e0b; color: #92400e; }
                .badge-blue { background: #e0f2fe; border-color: #38bdf8; color: #075985; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 14px; font-size: 11px; }
                th, td { border: 1px solid #334155; padding: 6px 8px; text-align: right; }
                th { background: #f8fafc; font-weight: 800; }
                .sec-head { background: #e2e8f0; font-weight: 900; font-size: 12px; color: #0f172a; }
                .sec-head-face { background: #fef3c7; color: #78350f; font-weight: 900; font-size: 12px; }
                .sec-head-base { background: #e0e7ff; color: #312e81; font-weight: 900; font-size: 12px; }
                .highlight-val { font-weight: 900; font-family: monospace; font-size: 12px; }
                .notes { margin-top: 14px; border: 1.5px dashed #94a3b8; padding: 10px 14px; font-size: 10.5px; background: #f8fafc; line-height: 1.6; border-radius: 6px; }
                .sigs { margin-top: 24px; display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; padding-top: 10px; border-top: 1px solid #cbd5e1; }
                @media print {
                    body { padding: 12px; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="header-top">
                    <img src="assets/madmak_symbol.png" alt="MADMAK" class="header-logo" style="width:52px; height:52px; object-fit:contain;">
                    <div style="flex:1; text-align:center;">
                        <h2>شركة مِدماك للحلول الخرسانية والإنترلوك الديكوري</h2>
                        <p>MADMAK CONCRETE SOLUTIONS | أمر تشغيل وصب ميداني للورشة (Work Order) | سبتمبر 2026</p>
                    </div>
                    <div style="font-size:10px; text-align:left; color:#64748b; font-family:monospace; line-height:1.3;">
                        <div>سجل: 104882</div>
                        <div>ب.ض: 684-219</div>
                        <div>مدينة بدر</div>
                    </div>
                </div>
                <div class="meta-badges">
                    <span class="badge badge-gold">المساحة الصافية: ${area} م² (شاملة الهالك 5%: ${res.totalAreaWithWaste} م²)</span>
                    <span class="badge badge-blue">السمك: ${thickness} سم | التشطيب: ${isColored ? "ملون فاخر (بايفيروكس)" : "رمادي ناعم"}</span>
                    <span class="badge">الوزن الإجمالي: ${res.totalWeightTons} طن</span>
                    <span class="badge badge-gold">إجمالي القلَبات: ${res.batchesCount} قلبة (${mixerCap} م² للقلبة)</span>
                </div>
            </div>

            <!-- Table 1: مقادير القلبة الواحدة للعمال -->
            <table>
                <tr>
                    <th colspan="3" class="sec-head-face">
                        أولاً: عيار القلبة الواحدة في الخلاطة 125 سم (${mixerCap} م² خرسانة) - لمعلم الخلطة والعمال
                    </th>
                </tr>
                <tr>
                    <th width="40%">المكون والخامة</th>
                    <th width="30%">مقدار القلبة الواحدة (بالكيلو والجرام)</th>
                    <th width="30%">تعليمات المعايرة بالورشة</th>
                </tr>
                <tr>
                    <td><strong>أسمنت أبيض (52.5N) لطبقة الوجه:</strong></td>
                    <td class="highlight-val">${isColored ? sb.faceMix.whiteCementKg + " كجم" : "0 كجم (وجه رمادي)"}</td>
                    <td>${isColored ? `وزن دقيق (${sb.faceMix.whiteCementBags} شكارة)` : "غير مطلوب"}</td>
                </tr>
                <tr>
                    <td><strong>رمل سيليكا ناعم خالي طفلة:</strong></td>
                    <td class="highlight-val">${isColored ? sb.faceMix.silicaSandKg + " كجم" : "0 كجم"}</td>
                    <td>منخول جاف ونظيف 100%</td>
                </tr>
                <tr>
                    <td><strong>بودرة حجر كوارتز ناصعة:</strong></td>
                    <td class="highlight-val">${isColored ? sb.faceMix.stonePowderKg + " كجم" : "0 كجم"}</td>
                    <td>لتحقيق النعومة الزجاجية ومقاومة البري</td>
                </tr>
                <tr>
                    <td><strong>أكاسيد بايفيروكس ألماني (Oxide):</strong></td>
                    <td class="highlight-val" style="color:#b91c1c;">${isColored ? sb.faceMix.oxideGrams.toLocaleString() + " جرام" : "0 جرام"}</td>
                    <td><strong style="color:#b91c1c;">بالميزان الديجيتال الحساس (ممنوع الكوز)</strong></td>
                </tr>
                <tr>
                    <td><strong>ملدن كيميائي فائق (PCE Polymer):</strong></td>
                    <td class="highlight-val" style="color:#1d4ed8;">${sb.faceMix.pceGrams.toLocaleString()} جرام</td>
                    <td>يُذاب تماماً في مياه الوجه قبل سكبه</td>
                </tr>
                <tr>
                    <td><strong>مياه الخلط لطبقة الوجه (Water):</strong></td>
                    <td class="highlight-val" style="color:#0e7490;">${sb.faceMix.waterLiters} لتر</td>
                    <td>نسبة W/C ≤ 0.28 صارمة (عجينة لزجة كريمة)</td>
                </tr>

                <tr>
                    <th colspan="3" class="sec-head-base">
                        ثانياً: عيار طبقة الظهرية والعصب الإنشائي لنفس القلبة (${mixerCap} م² - سمك ${thickness - 1.5} سم)
                    </th>
                </tr>
                <tr>
                    <td><strong>أسمنت بورتلاندي عادي رمادي (42.5N):</strong></td>
                    <td class="highlight-val">${sb.baseMix.greyCementKg} كجم</td>
                    <td>يعادل (${sb.baseMix.greyCementBags} شكارة رمادي)</td>
                </tr>
                <tr>
                    <td><strong>سن زيرو دولوميت عتاقة (0-5 مم):</strong></td>
                    <td class="highlight-val">${sb.baseMix.dolomiteKg} كجم</td>
                    <td><strong>${sb.baseMix.dolomiteBarrows} براويطة ممسوحة</strong> (70 كجم للبراويطة)</td>
                </tr>
                <tr>
                    <td><strong>رمل طبيعي حرش مغسول منخول:</strong></td>
                    <td class="highlight-val">${sb.baseMix.coarseSandKg} كجم</td>
                    <td><strong>${sb.baseMix.coarseSandBarrows} براويطة ممسوحة</strong></td>
                </tr>
                <tr>
                    <td><strong>ملدن خرساني للظهرية (PCE):</strong></td>
                    <td class="highlight-val" style="color:#1d4ed8;">${sb.baseMix.pceGrams.toLocaleString()} جرام</td>
                    <td>يُذاب في مياه الظهرية لتقليل المياه</td>
                </tr>
                <tr>
                    <td><strong>مياه خلط الظهرية:</strong></td>
                    <td class="highlight-val" style="color:#0e7490;">${sb.baseMix.waterLiters} لتر</td>
                    <td>خرسانة مفلفلة رطبة قليلة المياه (Semi-Dry)</td>
                </tr>
                <tr>
                    <td><strong>سائل عزل القوالب (استحلابي نقي):</strong></td>
                    <td class="highlight-val">${(res.accessories.oilLiters / res.batchesCount).toFixed(2)} لتر/قلبة</td>
                    <td>مسح إسفنجي معصور سريع بالقوالب</td>
                </tr>
            </table>

            <!-- Table 2: إجمالي الخامات للمخزن -->
            <table>
                <tr>
                    <th colspan="4" class="sec-head">ثالثاً: إجمالي خامات الطلبية المطلوبة للصرف من المخزن الرئيسي (Store Requisition)</th>
                </tr>
                <tr>
                    <td width="25%"><strong>أسمنت أبيض (52.5N):</strong></td>
                    <td width="25%" class="highlight-val">${isColored ? res.faceMix.whiteCementKg.toLocaleString() + " كجم (" + res.faceMix.whiteCementBags + " شكارة)" : "0"}</td>
                    <td width="25%"><strong>أسمنت رمادي (42.5N):</strong></td>
                    <td width="25%" class="highlight-val">${res.baseMix.greyCementKg.toLocaleString()} كجم (${res.baseMix.greyCementBags} شكارة)</td>
                </tr>
                <tr>
                    <td><strong>سن زيرو دولوميت عتاقة:</strong></td>
                    <td class="highlight-val">${res.baseMix.dolomiteTons} طن (${res.baseMix.dolomiteBarrowCount} براويطة)</td>
                    <td><strong>رمل سيليكا ناعم للوجه:</strong></td>
                    <td class="highlight-val">${isColored ? res.faceMix.silicaSandKg.toLocaleString() + " كجم" : "0"}</td>
                </tr>
                <tr>
                    <td><strong>رمل حرش طبيعي مغسول:</strong></td>
                    <td class="highlight-val">${res.baseMix.coarseSandTons} طن</td>
                    <td><strong>بودرة حجر كوارتز:</strong></td>
                    <td class="highlight-val">${isColored ? res.faceMix.stonePowderKg.toLocaleString() + " كجم" : "0"}</td>
                </tr>
                <tr>
                    <td><strong>أكسيد بايفيروكس ألماني:</strong></td>
                    <td class="highlight-val" style="color:#b91c1c;">${isColored ? res.faceMix.oxideKg + " كجم" : "0"}</td>
                    <td><strong>ملدن بولي كربوكسيلات (PCE):</strong></td>
                    <td class="highlight-val">${(parseFloat(res.faceMix.pceKg) + parseFloat(res.baseMix.pceKg)).toFixed(1)} كجم كلي</td>
                </tr>
                <tr>
                    <td><strong>سائل عزل القوالب المائي:</strong></td>
                    <td class="highlight-val">${res.accessories.oilLiters} لتر</td>
                    <td><strong>باليتات خشب ورول استرتش:</strong></td>
                    <td class="highlight-val">${res.accessories.palletsCount} باليتة + ${res.accessories.shrinkRolls} رول</td>
                </tr>
            </table>

            <div class="notes">
                <strong>تعليمات الجودة الصارمة لفورمان الصب والمعلم:</strong><br>
                1. <strong>الصب رطب-على-رطب (Wet-on-Wet):</strong> يتم صب الظهرية فوراً خلال 45-60 ثانية بعد فرد الوجه واهتزازه؛ ممنوع ترك الوجه ينشف نهائياً.<br>
                2. <strong>معايرة الأكسيد:</strong> وزن الأكسيد بالميزان الحساس حصراً بالجرام، وخلطه جافاً مع الأسمنت الأبيض والسيليكا دقيقتين قبل إضافة المياه.<br>
                3. <strong>زمن الاهتزاز:</strong> 15 ثانية لطبقة الوجه الرخامي + 45 ثانية لطبقة الظهرية على طاولة 3000 دورة/دقيقة لطرد كامل فقاعات الهواء.<br>
                4. <strong>المعالجة المائية والتخزين:</strong> المكوث 24 ساعة في مكان مظلل تماماً قبل فك القوالب، يتبعه رش رذاذي مستمر 4 مرات يومياً لمدة 7 أيام.
            </div>

            <div class="sigs">
                <div>توقيع فورمان الورشة: ................................</div>
                <div>توقيع أمين المخزن: ................................</div>
                <div>توقيع مهندس الجودة: ................................</div>
                <div>اعتماد مدير المصنع: ................................</div>
            </div>
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    printWin.document.close();
}

function printOfficialContract() {
    window.print();
}

window.selectTileForOrder = selectTileForOrder;
window.filterCatalog = filterCatalog;
window.openCalcForTile = openCalcForTile;
window.printWorkOrder = printWorkOrder;
window.printOfficialContract = printOfficialContract;
window.switchTab = switchTab;
window.setDocMode = setDocMode;
window.regenerateDocNumber = regenerateDocNumber;
window.copyDocText = copyDocText;
window.showDocToast = showDocToast;
window.toggleChecklistItem = toggleChecklistItem;
window.updateReadinessScore = updateReadinessScore;
window.setRecipeViewMode = setRecipeViewMode;
window.setAreaPreset = setAreaPreset;
window.sendBatchToContract = sendBatchToContract;

/* ═════════════════════════════════════════════════════════════
   MODULES INTERACTIVE LOGIC (Integrated from 1.html & 2.html)
═════════════════════════════════════════════════════════════════ */

/* ── 1) تفاعل المقطع التشريحي ثلاثي الأبعاد ── */
function initPaverAnatomy() {
    const layerInfoBox = document.getElementById('layerInfoBox');
    if (!layerInfoBox) return;
    const layerInfoDefault = layerInfoBox.innerHTML;
    const layerInfos = {
        face: '<span><strong class="text-amber-600">طبقة الوجه (Face Mix):</strong> 1.5 سم أسمنت أبيض 52.5N + سيليكا + أكاسيد + PCE بنسبة W/C = 0.28 — مسؤولة عن النعومة واللون ومقاومة الاحتكاك والامتصاص.</span><span class="font-bold text-amber-700">نعومة مرآة Mirror Finish</span>',
        base: '<span><strong class="text-slate-700">طبقة الظهرية (Base Mix):</strong> 4.5 سم سن زيرو دولوميت + رمل حرش مغسول + أسمنت رمادي 350 كجم/م³ — العصب الإنشائي الحامل للأحمال حتى 45 طن.</span><span class="font-bold text-emerald-700">إجهاد > 450 كجم/سم²</span>'
    };
    const faceEl = document.getElementById('faceLayerGroup');
    const baseEl = document.getElementById('baseLayerGroup');
    if (faceEl) {
        faceEl.addEventListener('mouseenter', () => layerInfoBox.innerHTML = layerInfos.face);
        faceEl.addEventListener('mouseleave', () => layerInfoBox.innerHTML = layerInfoDefault);
    }
    if (baseEl) {
        baseEl.addEventListener('mouseenter', () => layerInfoBox.innerHTML = layerInfos.base);
        baseEl.addEventListener('mouseleave', () => layerInfoBox.innerHTML = layerInfoDefault);
    }
}

/* ── 2) محاكاة معمل الجرانيكس (3 حالات) ── */
function setGranixState(state) {
    const tile = document.getElementById('granixTilePreview');
    const expl = document.getElementById('granixExplText');
    if (!tile) return;

    tile.className = tile.className.replace(/state-\w+/g, '').trim() + ' state-' + state;
    const btns = { before: 'btnBefore', after: 'btnAfter', glow: 'btnGlow' };
    Object.keys(btns).forEach(k => {
        const b = document.getElementById(btns[k]);
        if (b) {
            if (k === state) {
                b.className = 'px-3 py-1.5 text-xs rounded-xl bg-amber-600 text-white font-bold shadow-md shadow-amber-600/20 transition';
            } else {
                b.className = 'px-3 py-1.5 text-xs rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold border border-slate-200 transition';
            }
        }
    });

    if (expl) {
        if (state === 'before') {
            expl.innerHTML = '<span class="font-bold text-amber-700 block text-sm mb-1">الحالة بعد فك القالب مباشرة:</span><p class="text-slate-600 leading-relaxed">وش البلاطة أملس لكن مغطى بروبة أسمنت بيضاء ناعمة تخفي كل فصوص الجرانيت الملونة. تبدو مثل أي بلاطة عادية قبل الغسيل بالحمض.</p>';
        } else if (state === 'after') {
            expl.innerHTML = '<span class="font-bold text-emerald-700 block text-sm mb-1">النتيجة بعد التحميض والسيلر اللامع (Wet Look):</span><p class="text-slate-600 leading-relaxed">الحبيبات تبرز بمقدار 0.5 إلى 1 مم عن السطح، وتكتسب لمعاناً كريستالياً دائماً. البلاطة تبدو كقطعة حجر جرانيتي طبيعي فائق الفخامة ومضادة للانزلاق تماماً.</p>';
        } else {
            expl.innerHTML = '<span class="font-bold text-cyan-700 block text-sm mb-1">الوضع الليلي بالحصى الفوتولومينيسنت:</span><p class="text-slate-600 leading-relaxed">بإضافة 8% حصى مضيء (Photoluminescent) للخلطة، تشحن الحبيبات من ضوء النهار وتتوهج ليلاً بلون سماوي ساحر حول المسابح والممرات — تباع بسعر 450+ ج.م للمتر.</p>';
        }
    }
}

/* ── 3) محاكاة خط الإنتاج بالماكينات الثلاث ── */
let autoTimer = null;
let currentStepNumber = 1;

function showStep(num) {
    currentStepNumber = num;
    const steps = PROJECT_DATA.pipelineSteps || [];
    const d = steps.find(s => s.num === num) || steps[num - 1];

    for (let i = 1; i <= 5; i++) {
        const btn = document.getElementById('stepBtn' + i);
        if (btn) {
            btn.className = (i === num)
                ? "p-3 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                : "p-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition";
        }
    }

    if (d) {
        const badgeEl   = document.getElementById('stepBadgeNumber');
        const titleEl   = document.getElementById('stepTitle');
        const machineEl = document.getElementById('stepMachineTag');
        const descEl    = document.getElementById('stepDescription');
        const timeEl    = document.getElementById('stepTimeParam');
        const mistEl    = document.getElementById('stepMistakeParam');
        const graphEl   = document.getElementById('stepGraphicContainer');

        if (badgeEl) badgeEl.innerText = num;
        if (titleEl) titleEl.innerText = d.title;
        if (machineEl) machineEl.innerText = d.machine;
        if (descEl) descEl.innerText = d.desc;
        if (timeEl) timeEl.innerText = d.time;
        if (mistEl) mistEl.innerText = d.mistake;
        if (graphEl) graphEl.innerHTML = d.svg;
    }
}

function toggleAutoPlay() {
    const btn = document.getElementById('autoPlayBtn');
    if (!btn) return;
    if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
        btn.innerHTML = '<i class="fa-solid fa-play ml-1"></i> تشغيل المحاكاة تلقائياً';
    } else {
        autoTimer = setInterval(() => {
            currentStepNumber = (currentStepNumber % 5) + 1;
            showStep(currentStepNumber);
        }, 3500);
        btn.innerHTML = '<i class="fa-solid fa-pause ml-1"></i> إيقاف التشغيل التلقائي';
    }
}

/* ── 4) عيادة الجودة وعيوب الصب الفورية ── */
const clinicIssues = {
    pinholes: {
        title: "العامل زوّد زيت العزل، أو الميه زيادة في العجنة، أو قصر وقت الهز",
        desc: "لو العامل دهن القالب بالزيت وعمل بركة صغيرة في القاع، الزيت بيتفاعل مع الأسمنت ويحبس فقاقيع الهواء. كمان لو هزيت القالب أقل من 10 ثوانٍ على الطاولة، فقاعات الهواء مبتهربش وبتفضل لازقة في وش البلاطة.",
        remedies: [
            "امسح القالب بإسفنجة شبه جافة تشيل أي نقطة زيت زيادة قبل الصب.",
            "قلل مياه الخلط لنسبة W/C=0.28 وزوّد الملدن (PCE) لزيادة السيولة بدون ماء حر.",
            "خلّي زمن هز طبقة الوجه 15 ثانية بالضبط على الطاولة لطرد الهواء تماماً."
        ]
    },
    edges: {
        title: "الاستعجال والفك قبل 24 ساعة، أو عيار فكاكة السير مش مظبوط",
        desc: "الخرسانة بتكون لسه طرية والشك الابتدائي مكملش لو فكيت بعد 12 أو 16 ساعة بس. أو إن الشياليونات المعدنية في الفكاكة واسعة فالبلاطة بتخبط في الحواف الحديدية وهي نازلة.",
        remedies: [
            "ممنوع نهائياً فك أي قالب قبل مرور 24 ساعة كاملة على الأرفف المظللة.",
            "اضبط فتحة شياليونات فكاكة السير على مقاس القالب بالضبط بزيادة 2 مم بس.",
            "تأكد من إضافة الملدن بنسبته الصحيحة لإعطاء صلابة مبكرة سريعة."
        ]
    },
    efflorescence: {
        title: "استخدام رمل غير مغسول فيه أملاح، أو مياه جوفية مالحة، أو بخر شمسي سريع",
        desc: "الأملاح الحرة (كربونات الكالسيوم) بتخرج مع تبخر المياه وتعمل بودرة وقشور بيضاء تشوه الألوان الزاهية، أو ترك البلاط ينشف تحت شمس الصيف المباشرة بدون تغطية.",
        remedies: [
            "اشتري رمل حرش ورمل سيليكا مغسول من محاجر نظيفة ومعتمدة حصراً خالية من الطفلة.",
            "استخدم مياه شرب نقية وعذبة في الخلط والرش المائي (ممنوع مياه الآبار المالحة).",
            "غطّي البلاط بمشمع بلاستيك فوراً أثناء الرش المائي لمدة 7 أيام لحبس الرطوبة."
        ]
    },
    delamination: {
        title: "ترك طبقة الوجه تنشف وتتماسك في القالب قبل صب الظهرية",
        desc: "لو العامل صب الوجه وسابه 20 دقيقة ونشف جزئياً، وبعدين نزل بخرسانة الظهرية، مش هيحصل التحام بلوري ميكانيكي بينهما، وهتلاقي وش البلاطة بيقشر وينفصل زي البسكويت!",
        remedies: [
            "طبق قاعدة (Wet-on-Wet) الصب رطب على رطب فوراً بدون تأخير دقيقة واحدة.",
            "أول ما تخلص هز طبقة الوجه 15 ثانية، العامل يفرغ الظهرية مباشرة ويهز 45 ثانية.",
            "تأكد إن خلطة الظهرية فيها نسبة ملدن كافية للالتصاق بطبقة الوجه."
        ]
    },
    color: {
        title: "وزن الأكسيد بالتقدير مش بالميزان، أو تغيير ماركة الأسمنت بين الصبات",
        desc: "فرق جرام واحد في الأكسيد لكل قلبة بيغيّر درجة اللون تماماً، وكمان اختلاف دفعة الأسمنت الأبيض أو ترك الخلط يدوب وقت أطول من اللازم بيعمل بقع وتفاوت لوني بين بلاطات نفس الطلبية.",
        remedies: [
            "وزن الأكسيد بالميزان الديجيتال (دقة 1 جم) لكل قلبة وسجّل الوزن في دفتر الورشة.",
            "ثبّت مورد وماركة الأسمنت الأبيض للطلبية الكاملة ولا تغيّرها منتصف الشغل.",
            "وحّد زمن الخلط (3-4 دقائق) لكل القلبات بنفس ترتيب إضافة المكونات."
        ]
    },
    cracks: {
        title: "بخر سريع للمياه: شمس مباشرة أو تيار هواء جاف في أول 24 ساعة",
        desc: "الخرسانة اللدنة لما تفقد مياهها بسرعة قبل الشك بتنكمش سطحياً وتتشقق شروخ شعرية متعرجة (Plastic Shrinkage)، وده بيحصل كثيراً في صيف بدر مع نسيم جاف داخل الجمالون.",
        remedies: [
            "ظلّل عنبر التجفيف تماماً وسد فتحات التيار الهوائي المباشر بالشباك البلاستيك.",
            "رشّ رذاذ خفيف (ضباب) بعد ساعتين من الصب في الأيام شديدة الحرارة.",
            "استخدم ملدن فائق لتقليل ماء الخلط مع إحكام تغطية الأرفف بالبلاستيك."
        ]
    }
};

function diagnoseIssue(type) {
    const d = clinicIssues[type];
    if (!d) return;

    const titleEl  = document.getElementById('diagCauseTitle');
    const descEl   = document.getElementById('diagCauseDesc');
    const remedyEl = document.getElementById('diagRemedyList');

    if (titleEl) titleEl.innerText = d.title;
    if (descEl) descEl.innerText = d.desc;
    if (remedyEl) {
        remedyEl.innerHTML = d.remedies.map(r =>
            `<li class="flex items-start gap-2.5"><i class="fa-solid fa-circle-check text-emerald-600 mt-1 shrink-0"></i><span class="text-slate-700 leading-relaxed">${r}</span></li>`
        ).join('');
    }

    document.querySelectorAll('.issue-tab').forEach(b => {
        b.classList.toggle('active-issue', b.dataset.issue === type);
    });
}

/* ── 5) اختبار المعلم الذكي (Quiz) ── */
let currentQuizIndex = 0;
let currentQuizScore = 0;
let isQuizAnswered = false;

function renderQuiz() {
    const list = PROJECT_DATA.quizData || [];
    if (!list.length) return;
    const item = list[currentQuizIndex];
    if (!item) return;

    isQuizAnswered = false;
    const progEl = document.getElementById('quizProgress');
    const qEl    = document.getElementById('quizQuestion');
    const fbEl   = document.getElementById('quizFeedback');
    const nextEl = document.getElementById('quizNextBtn');
    const optsEl = document.getElementById('quizOptions');

    if (progEl) progEl.innerText = `السؤال ${currentQuizIndex + 1} من ${list.length} — النقاط: ${currentQuizScore}`;
    if (qEl) qEl.innerText = item.q;
    if (fbEl) fbEl.className = 'hidden text-xs font-bold p-3.5 rounded-xl max-w-md mx-auto leading-relaxed';
    if (nextEl) nextEl.classList.add('hidden');

    if (optsEl) {
        optsEl.innerHTML = item.opts.map((o, i) =>
            `<button onclick="handleQuiz(${o.ok}, ${i})" class="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm ${
                o.ok ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
            }">${o.t}</button>`
        ).join('');
    }
}

function handleQuiz(isCorrect) {
    if (isQuizAnswered) return;
    isQuizAnswered = true;

    const list = PROJECT_DATA.quizData || [];
    const item = list[currentQuizIndex];
    const fbEl = document.getElementById('quizFeedback');
    const nextEl = document.getElementById('quizNextBtn');

    if (fbEl) {
        fbEl.classList.remove('hidden', 'bg-rose-50', 'text-rose-800', 'border-rose-200', 'bg-emerald-50', 'text-emerald-800', 'border-emerald-200');
        if (isCorrect) {
            currentQuizScore++;
            fbEl.className = 'text-xs font-bold p-3.5 rounded-xl max-w-md mx-auto leading-relaxed bg-emerald-50 text-emerald-800 border border-emerald-200 block shadow-sm';
            fbEl.innerHTML = item.yes;
            if (typeof confetti === 'function') {
                confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
            }
        } else {
            fbEl.className = 'text-xs font-bold p-3.5 rounded-xl max-w-md mx-auto leading-relaxed bg-rose-50 text-rose-800 border border-rose-200 block shadow-sm';
            fbEl.innerHTML = item.no;
        }
    }

    if (nextEl) {
        nextEl.classList.remove('hidden');
        nextEl.innerHTML = (currentQuizIndex === list.length - 1)
            ? 'عرض النتيجة النهائية <i class="fa-solid fa-flag-checkered mr-1"></i>'
            : 'السؤال التالي <i class="fa-solid fa-arrow-left mr-1"></i>';
    }
}

function nextQuestion() {
    const list = PROJECT_DATA.quizData || [];
    if (currentQuizIndex < list.length - 1) {
        currentQuizIndex++;
        renderQuiz();
    } else {
        const fbEl = document.getElementById('quizFeedback');
        const nextEl = document.getElementById('quizNextBtn');
        if (fbEl) {
            fbEl.className = 'text-xs sm:text-sm font-bold p-4 rounded-xl max-w-md mx-auto leading-relaxed block shadow-sm ' +
                (currentQuizScore === list.length ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-amber-50 text-amber-900 border border-amber-300');
            if (currentQuizScore === list.length) {
                fbEl.innerHTML = `🏆 علامة كاملة ${currentQuizScore}/${list.length}! أنت معلم صب معتمد في أكاديمية مِدماك، ورشتك جاهزة لإنتاج أفخم بلاط Wet-Cast فوراً!`;
                if (typeof confetti === 'function') confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
            } else {
                fbEl.innerHTML = `📚 نتيجتك ${currentQuizScore}/${list.length}. راجع بنود الخلطة والأسرار الفنية لإتقان كافة معايير الجودة 100%!`;
            }
        }
        if (nextEl) {
            nextEl.innerHTML = 'إعادة الاختبار <i class="fa-solid fa-rotate-right mr-1"></i>';
            nextEl.onclick = () => {
                currentQuizIndex = 0;
                currentQuizScore = 0;
                nextEl.onclick = nextQuestion;
                renderQuiz();
            };
        }
        isQuizAnswered = true;
    }
}

// Export interactive methods
window.renderMultiProductPricesTable = renderMultiProductPricesTable;
window.renderEquipmentTable = renderEquipmentTable;
window.renderSuppliersMap = renderSuppliersMap;
window.initPaverAnatomy = initPaverAnatomy;
window.setGranixState = setGranixState;
window.showStep = showStep;
window.toggleAutoPlay = toggleAutoPlay;
window.diagnoseIssue = diagnoseIssue;
window.renderQuiz = renderQuiz;
window.handleQuiz = handleQuiz;
window.nextQuestion = nextQuestion;



