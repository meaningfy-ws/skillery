% Same toy playbook in ASP (clingo). Same semantics as playbook.py.
val(client,public;client,private;client,us; channel,email;channel,tender;channel,call; lang,en;lang,fr).
dim(D) :- val(D,_).
str(hard,3;default,2;soft,1).

rule(r1,spelling,british,default).     rule(r2,spelling,american,default). scope(r2,client,us).
rule(r3,send,after_approval,hard).
rule(r4,first_step,compliance_matrix,default). scope(r4,channel,tender).
rule(r5,pricing,fixed,default).        scope(r5,client,public).
rule(r6,pricing,time_and_materials,default). scope(r6,channel,tender).
rule(r7,length,under_400_words,soft).  scope(r7,channel,email).
rule(r8,length,under_400_words,soft).  scope(r8,client,us). scope(r8,channel,email).
rule(r9,send,immediately,default).     scope(r9,lang,fr).

% one situation per answer set
1 { sit(D,V) : val(D,V) } 1 :- dim(D).
fires(R) :- rule(R,_,_,_), sit(D,V) : scope(R,D,V).
nsc(R,N) :- rule(R,_,_,_), N = #count { D : scope(R,D,_) }.
% o beats r: stronger, or same strength and strictly more specific (superset scope)
beats(O,R) :- fires(O), fires(R), rule(O,S,_,SO), rule(R,S,_,SR), str(SO,A), str(SR,B), A > B.
beats(O,R) :- fires(O), fires(R), rule(O,S,_,X), rule(R,S,_,X), O != R,
              scope(O,D,V) : scope(R,D,V); nsc(O,NO); nsc(R,NR); NO > NR.
wins(R) :- fires(R), not beats(_,R).
conflict(R1,R2,S) :- wins(R1), wins(R2), rule(R1,S,V1,_), rule(R2,S,V2,_), V1 != V2, R1 < R2.
#show conflict/3.
#show sit/2.
