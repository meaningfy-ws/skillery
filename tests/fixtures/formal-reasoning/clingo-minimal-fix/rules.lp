%% Any rule may be dropped from the set.
{ drop(R) } :- rule(R,_,_).
%% A rule is kept unless it is dropped.
kept(R) :- rule(R,_,_), not drop(R).
%% Two kept rules must not set the same slot to different values.
:- kept(R1), kept(R2), rule(R1,S,V1), rule(R2,S,V2), V1 != V2.
#minimize { 1,R : drop(R) }.
