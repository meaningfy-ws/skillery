%% A dimension is anything that has a value.
dim(D) :- val(D,_).
%% Each situation picks exactly one value per dimension.
1 { sit(D,V) : val(D,V) } 1 :- dim(D).
%% A rule fires when the situation matches every part of its scope.
fires(R) :- rule(R,_,_,_), sit(D,V) : scope(R,D,V).
%% N is the number of dimensions in a rule's scope.
nsc(R,N) :- rule(R,_,_,_), N = #count { D : scope(R,D,_) }.
%% A firing rule beats another firing rule on the same slot when it is stronger.
beats(O,R) :- fires(O), fires(R), rule(O,S,_,SO), rule(R,S,_,SR), str(SO,A), str(SR,B), A > B.
%% At the same strength, a rule beats another when its scope is a strict superset.
beats(O,R) :- fires(O), fires(R), rule(O,S,_,X), rule(R,S,_,X), O != R,
              scope(O,D,V) : scope(R,D,V); nsc(O,NO); nsc(R,NR); NO > NR.
%% A rule wins when it fires and nothing beats it.
wins(R) :- fires(R), not beats(_,R).
%% Two winning rules conflict when they set the same slot to different values.
conflict(R1,R2,S) :- wins(R1), wins(R2), rule(R1,S,V1,_), rule(R2,S,V2,_), V1 != V2, R1 < R2.
#show conflict/3.
#show sit/2.
%% Two clashing rules clash in every situation that matches both their scopes.
clash_on(R1,R2,D,V) :- conflict(R1,R2,_), scope(R1,D,V).
%% The second rule's scope is part of that situation too.
clash_on(R1,R2,D,V) :- conflict(R1,R2,_), scope(R2,D,V).
