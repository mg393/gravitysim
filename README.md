gravitysim
==========

changelog
---------
###31
+ Removed all references to "objects", now named "bodies" to avoid confusion. Replaced o[] with b[].
+ Progress towards functional gravity

###30
+ Fixed readme
+ Got started on fixing gravity

###29
+   Added clear objects function
+   Added pause function
+   Beautified gravity.js


Fixing Gravity Notes
--------------------
+   forceY isn't 0 when object is same
+   Distance isn't being calculated properly - increases when objects move together
+   Distance isn't 0 for same object
+   Angles seem to be correct - try working out force components by hand
