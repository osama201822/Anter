/**
 * المحركات الحسابية لمصنع الإنترلوك بمدينة بدر 2026
 * حاسبة الخلطة الدقيقة + المحاكي المالي التفاعلي للجدوى الاقتصادية
 * محدثة بالكامل وفق أسعار سبتمبر 2026
 */

const CALCULATORS = {
    /**
     * حاسبة مقادير الخلطة والقلبة المعملية لأي كمية أمتار مربعة
     * تدعم الحساب لإجمالي الطلبية وللقلبة الواحدة بالخلاطة (حلة 125 سم)
     */
    calculateBatch: function(areaM2, thicknessCm, isColored, wastePercent, mixerBatchM2 = 2) {
        const totalAreaWithWaste = areaM2 * (1 + (wastePercent / 100));
        
        // نسب المتر المربع القياسي حسب السماكة ونوع التشطيب (تدعم 3 سم، 4 سم، 6 سم، 8 سم)
        let whiteCementPerM2 = isColored ? (thicknessCm <= 3 ? 5 : thicknessCm === 4 ? 6 : thicknessCm === 8 ? 10 : 8) : 0;
        let greyCementPerM2 = isColored ? (thicknessCm <= 3 ? 9 : thicknessCm === 4 ? 12 : thicknessCm === 8 ? 22 : 16) : (thicknessCm <= 3 ? 14 : thicknessCm === 4 ? 18 : thicknessCm === 8 ? 32 : 24);
        let silicaSandPerM2 = isColored ? (thicknessCm <= 3 ? 5 : thicknessCm === 4 ? 6 : thicknessCm === 8 ? 10 : 8) : 0;
        let stonePowderPerM2 = isColored ? (thicknessCm <= 3 ? 2.5 : thicknessCm === 4 ? 3 : thicknessCm === 8 ? 5 : 4) : 0;
        let oxidePerM2 = isColored ? (thicknessCm <= 3 ? 0.18 : thicknessCm === 4 ? 0.22 : thicknessCm === 8 ? 0.35 : 0.30) : 0;
        let pcePerM2 = thicknessCm <= 3 ? 0.15 : thicknessCm === 4 ? 0.20 : thicknessCm === 8 ? 0.35 : 0.25;
        let dolomitePerM2 = thicknessCm <= 3 ? 28 : thicknessCm === 4 ? 40 : thicknessCm === 8 ? 75 : 55;
        let coarseSandPerM2 = thicknessCm <= 3 ? 25 : thicknessCm === 4 ? 35 : thicknessCm === 8 ? 65 : 50;
        let waterPerM2 = thicknessCm <= 3 ? 4.0 : thicknessCm === 4 ? 5.5 : thicknessCm === 8 ? 9.5 : 7.5;
        let oilPerM2 = 0.08;
        let weightPerM2 = thicknessCm <= 3 ? 70 : thicknessCm === 4 ? 95 : thicknessCm === 8 ? 180 : 138;

        // الحسابات الإجمالية للطلبية
        const totalWhiteCementKg = whiteCementPerM2 * totalAreaWithWaste;
        const totalGreyCementKg = greyCementPerM2 * totalAreaWithWaste;
        const totalSilicaSandKg = silicaSandPerM2 * totalAreaWithWaste;
        const totalStonePowderKg = stonePowderPerM2 * totalAreaWithWaste;
        const totalOxideKg = oxidePerM2 * totalAreaWithWaste;
        const totalPceKg = pcePerM2 * totalAreaWithWaste;
        const totalDolomiteKg = dolomitePerM2 * totalAreaWithWaste;
        const totalCoarseSandKg = coarseSandPerM2 * totalAreaWithWaste;
        const totalWaterLiters = waterPerM2 * totalAreaWithWaste;
        const totalOilLiters = oilPerM2 * totalAreaWithWaste;
        const totalWeightTons = (weightPerM2 * totalAreaWithWaste) / 1000;

        // حساب تكلفة الخامات المباشرة للطلبية (أسعار سبتمبر 2026)
        const costWhite = totalWhiteCementKg * 5.20;
        const costGrey = totalGreyCementKg * 2.40;
        const costSilica = totalSilicaSandKg * 0.15;
        const costStone = totalStonePowderKg * 0.20;
        const costOxide = totalOxideKg * 110.00;
        const costPce = totalPceKg * 75.00;
        const costDolomite = totalDolomiteKg * 0.21;
        const costCoarseSand = totalCoarseSandKg * 0.12;
        const costOil = totalOilLiters * 50.00;
        const totalRawMaterialCost = costWhite + costGrey + costSilica + costStone + costOxide + costPce + costDolomite + costCoarseSand + costOil;

        // تقدير سعر البيع الإجمالي وقيمة الإيراد المتوقعة
        const unitSellingPrice = thicknessCm === 4 ? (isColored ? 245 : 190) : thicknessCm === 8 ? (isColored ? 360 : 280) : (isColored ? 285 : 220);
        const estimatedRevenue = areaM2 * unitSellingPrice;
        const estimatedGrossMargin = estimatedRevenue - totalRawMaterialCost - (areaM2 * 31.33); // بعد خصم أجور العمالة المباشرة

        // زمن الصب والمعالجة (طاقة الورشة 60 م²/يوم)
        const daysToProduce = Math.max(1, Math.ceil(totalAreaWithWaste / 60));
        const curingDays = 7; // معالجة مائية بالرش الرذاذي
        const totalLeadDays = daysToProduce + curingDays + 1; // +1 يوم تحضير وتجفيف أولي

        // عدد القلَبات بالخلاطة (افتراض سعة القلبة mixerBatchM2 = 2 م²)
        const batchesCount = Math.max(1, Math.ceil(totalAreaWithWaste / mixerBatchM2));

        // حساب مقادير القلبة الواحدة بالخلاطة للعمال
        const singleBatch = {
            mixerBatchM2: mixerBatchM2,
            batchWeightKg: Math.round(weightPerM2 * mixerBatchM2),
            faceMix: {
                whiteCementKg: (totalWhiteCementKg / batchesCount).toFixed(1),
                whiteCementBags: ((totalWhiteCementKg / batchesCount) / 50).toFixed(2),
                silicaSandKg: (totalSilicaSandKg / batchesCount).toFixed(1),
                stonePowderKg: (totalStonePowderKg / batchesCount).toFixed(1),
                oxideGrams: Math.round((totalOxideKg / batchesCount) * 1000),
                pceGrams: Math.round(((totalPceKg * 0.4) / batchesCount) * 1000),
                waterLiters: ((totalWaterLiters * 0.35) / batchesCount).toFixed(1)
            },
            baseMix: {
                greyCementKg: (totalGreyCementKg / batchesCount).toFixed(1),
                greyCementBags: ((totalGreyCementKg / batchesCount) / 50).toFixed(2),
                dolomiteKg: Math.round(totalDolomiteKg / batchesCount),
                dolomiteBarrows: (((totalDolomiteKg / batchesCount) / 70)).toFixed(1),
                coarseSandKg: Math.round(totalCoarseSandKg / batchesCount),
                coarseSandBarrows: (((totalCoarseSandKg / batchesCount) / 70)).toFixed(1),
                pceGrams: Math.round(((totalPceKg * 0.6) / batchesCount) * 1000),
                waterLiters: ((totalWaterLiters * 0.65) / batchesCount).toFixed(1)
            }
        };

        return {
            input: { areaM2, thicknessCm, isColored, wastePercent, mixerBatchM2 },
            totalAreaWithWaste: totalAreaWithWaste.toFixed(1),
            totalWeightTons: totalWeightTons.toFixed(2),
            daysToProduce,
            curingDays,
            totalLeadDays,
            batchesCount,
            mixerBatchM2,
            costPerM2Raw: Math.round(totalRawMaterialCost / totalAreaWithWaste),
            totalRawMaterialCost: Math.round(totalRawMaterialCost),
            estimatedRevenue: Math.round(estimatedRevenue),
            estimatedGrossMargin: Math.round(estimatedGrossMargin),
            faceMix: {
                whiteCementKg: Math.round(totalWhiteCementKg),
                whiteCementBags: (totalWhiteCementKg / 50).toFixed(1),
                silicaSandKg: Math.round(totalSilicaSandKg),
                stonePowderKg: Math.round(totalStonePowderKg),
                oxideKg: totalOxideKg.toFixed(2),
                pceKg: (totalPceKg * 0.4).toFixed(2), // 40% للوجه
                waterLiters: Math.round(totalWaterLiters * 0.35)
            },
            baseMix: {
                greyCementKg: Math.round(totalGreyCementKg),
                greyCementBags: (totalGreyCementKg / 50).toFixed(1),
                dolomiteTons: (totalDolomiteKg / 1000).toFixed(2),
                dolomiteBarrowCount: Math.round(totalDolomiteKg / 70), // براويطة 70 كجم
                coarseSandTons: (totalCoarseSandKg / 1000).toFixed(2),
                pceKg: (totalPceKg * 0.6).toFixed(2), // 60% للظهرية
                waterLiters: Math.round(totalWaterLiters * 0.65)
            },
            singleBatch,
            accessories: {
                oilLiters: Math.round(totalOilLiters),
                palletsCount: Math.ceil(totalAreaWithWaste / 14), // 14 م² لكل باليتة خشبية
                shrinkRolls: Math.ceil(totalAreaWithWaste / 50),
                trucksCount: Math.max(1, Math.ceil(totalWeightTons / 15)) // نقلة تريلا 15 طن
            }
        };
    },

    /**
     * المحاكي المالي التفاعلي للجدوى الاقتصادية والأرباح
     */
    simulateFinancials: function(monthlyM2, avgSellingPrice, premiumRatio, whiteCementPriceTon, greyCementPriceTon) {
        // حساب تكلفة المواد للمتر بحسب أسعار الأسمنت المدخلة (الأساس: 5200 للأبيض، 2400 للرمادي)
        const whiteDeltaPerKg = (whiteCementPriceTon - 5200) / 1000;
        const greyDeltaPerKg = (greyCementPriceTon - 2400) / 1000;

        // تكلفة المتر الملون القياسي 6 سم (8 كجم أبيض، 16 كجم رمادي)
        const baseMaterialCost = 155.30;
        const adjustedMaterialCostPerM2 = baseMaterialCost + (8 * whiteDeltaPerKg) + (16 * greyDeltaPerKg);
        
        // تكلفة العمالة للمتر المربع حسب حجم الإنتاج (إجمالي أجور الورشة 47,000 ج.م شهرياً)
        const laborCostPerM2 = 47000 / monthlyM2;
        
        // الكهرباء والمياه لكل م² (5.50 ج)
        const powerWaterPerM2 = 5.50;
        
        // إهلاك القوالب وصيانة الماكينات للمتر (6.50 ج)
        const depreciationPerM2 = 6.50;

        // إجمالي التكلفة المتغيرة للمتر
        const totalVariableCostPerM2 = adjustedMaterialCostPerM2 + laborCostPerM2 + powerWaterPerM2 + depreciationPerM2;

        // متوسط سعر البيع مع الأخذ في الاعتبار نسبة المنتجات الفاخرة (3D وباركيه) التي تزيد بـ 45 ج/م²
        const effectiveSellingPrice = avgSellingPrice + (premiumRatio * 45);

        // إجمالي الإيرادات الشهرية
        const monthlyRevenue = monthlyM2 * effectiveSellingPrice;

        // إجمالي التكاليف المتغيرة الشهرية
        const totalVariableCostsMonthly = monthlyM2 * totalVariableCostPerM2;

        // مجمل الربح الشهري (Gross Profit)
        const grossProfitMonthly = monthlyRevenue - totalVariableCostsMonthly;

        // التكاليف الثابتة الشهرية (الإيجار 26k، الإدارة 15k، الكهرباء 4.5k، التسويق 6k، الصيانة 4k، النثريات 3.5k)
        const fixedOpexMonthly = 59000;

        // صافي الربح التشغيلي الشهري (Net Profit / EBIT)
        const netProfitMonthly = grossProfitMonthly - fixedOpexMonthly;

        // هامش صافي الربح %
        const netMarginPercent = monthlyRevenue > 0 ? ((netProfitMonthly / monthlyRevenue) * 100) : 0;

        // نقطة التعادل الشهرية (Break-Even Point بالأمتار المربعة)
        const directMarginalCostPerM2 = adjustedMaterialCostPerM2 + powerWaterPerM2 + depreciationPerM2;
        const contributionMarginPerM2 = effectiveSellingPrice - directMarginalCostPerM2;
        const totalFixedBurden = fixedOpexMonthly + 47000; // الإيجار والإدارة + أجور العمالة الأساسية
        const breakEvenM2 = contributionMarginPerM2 > 0 ? Math.ceil(totalFixedBurden / contributionMarginPerM2) : 0;

        // فترة استرداد رأس المال الكلي المستثمر (900,000 ج.م)
        const totalInvestment = 900000;
        const paybackMonths = netProfitMonthly > 0 ? (totalInvestment / netProfitMonthly) : 999;

        // العائد السنوي على الاستثمار (Annual ROI)
        const annualNetProfit = netProfitMonthly * 12;
        const annualRoiPercent = (annualNetProfit / totalInvestment) * 100;

        return {
            monthlyM2,
            effectiveSellingPrice: effectiveSellingPrice.toFixed(1),
            totalVariableCostPerM2: totalVariableCostPerM2.toFixed(2),
            adjustedMaterialCostPerM2: adjustedMaterialCostPerM2.toFixed(2),
            monthlyRevenue: Math.round(monthlyRevenue),
            totalVariableCostsMonthly: Math.round(totalVariableCostsMonthly),
            grossProfitMonthly: Math.round(grossProfitMonthly),
            fixedOpexMonthly,
            netProfitMonthly: Math.round(netProfitMonthly),
            netMarginPercent: netMarginPercent.toFixed(1),
            breakEvenM2,
            paybackMonths: paybackMonths < 99 ? paybackMonths.toFixed(1) : "غير محقق",
            annualRoiPercent: Math.round(annualRoiPercent)
        };
    }
};

if (typeof window !== "undefined") {
    window.CALCULATORS = CALCULATORS;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = CALCULATORS;
}

