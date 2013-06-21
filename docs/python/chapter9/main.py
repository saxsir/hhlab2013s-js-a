import advancedclassify

agesonly = advancedclassify.loadmatch('agesonly.csv', allnum=True)
matchmaker = advancedclassify.loadmatch('matchmaker.csv')

# advancedclassify.plotagematches(agesonly)
avgs = advancedclassify.lineartrain(agesonly)

print advancedclassify.dpclassify([30,30], avgs)
print advancedclassify.dpclassify([30,25], avgs)
print advancedclassify.dpclassify([25,40], avgs)
print advancedclassify.dpclassify([48,20], avgs)

print advancedclassify.getlocation('1 alewife center, cambridge, ma')
